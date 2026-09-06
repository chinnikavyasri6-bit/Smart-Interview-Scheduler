import { useEffect, useState } from "react";
import api from "../services/api";

function InterviewerDashboard({ user, onLogout }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api.get("/interviews");

      setInterviews(result.data || []);
    } catch (err) {
      setError(err.message || "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const upcomingInterviews = interviews.filter(
    (interview) =>
      interview.status === "confirmed" &&
      interview.selectedSlot?.start &&
      new Date(interview.selectedSlot.start) >= new Date()
  );

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed"
  );

  const cancelledInterviews = interviews.filter(
    (interview) => interview.status === "cancelled"
  );

  return (
    <div className="interviewer-dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>
          <div className="brand">
            Smart<span>Interview</span>
          </div>

          <p className="dashboard-subtitle">
            Interviewer Portal
          </p>
        </div>

        <div className="header-actions">

          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>

          <button
            className="secondary-button"
            onClick={loadInterviews}
          >
            Refresh
          </button>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="dashboard-main">

        {/* WELCOME */}

        <section className="welcome-section">

          <p className="eyebrow">
  🧑‍💼 Interviewer workspace
</p>

          <h1>
  Your interview schedule 📅
</h1>

          <p>
            Review your assigned interviews and join
            scheduled sessions from one place.
          </p>

        </section>


        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card">
            <span className="stat-label">
  📋 Total Interviews
</span>

            <strong>
              {interviews.length}
            </strong>
          </div>


          <div className="stat-card">
            <span className="stat-label">
  🔜 Upcoming
</span>

            <strong>
              {upcomingInterviews.length}
            </strong>
          </div>


          <div className="stat-card">
            <span className="stat-label">
  ✅ Completed
</span>

            <strong>
              {completedInterviews.length}
            </strong>
          </div>


          <div className="stat-card">
            <span className="stat-label">
  ❌ Cancelled
</span>

            <strong>
              {cancelledInterviews.length}
            </strong>
          </div>

        </section>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* INTERVIEWS */}

        {loading ? (

          <div className="empty-state">
            Loading your interview schedule...
          </div>

        ) : (

          <section className="interviews-section">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
  🎯 Assigned sessions
</p>

                <h2>
                  Your Interviews
                </h2>
              </div>

              <span className="count-badge">
                {interviews.length}
              </span>

            </div>


            {interviews.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📅
                </div>

                <h3>
                  No interviews assigned
                </h3>

                <p>
                  Interviews assigned to you will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="interview-list">

                {interviews.map((interview) => (

                  <article
                    className="interview-card"
                    key={interview._id}
                  >

                    {/* CARD HEADER */}

                    <div className="interview-card-top">

                      <div>

                        <p className="interview-type">
                          {interview.interviewType ||
                            "Interview"}
                        </p>

                        <h3>
                          {interview.title}
                        </h3>

                      </div>

                      <span
                        className={`status-badge status-${interview.status}`}
                      >
                        {interview.status}
                      </span>

                    </div>


                    {/* DETAILS */}

                    <div className="interview-details">

                      <div className="detail-item">

                        <span className="detail-label">
                          📅 Date
                        </span>

                        <strong>
                          {formatDate(
                            interview.selectedSlot?.start
                          )}
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span className="detail-label">
                          🕐 Time
                        </span>

                        <strong>
                          {interview.selectedSlot?.start
                            ? `${formatTime(
                                interview.selectedSlot.start
                              )} - ${formatTime(
                                interview.selectedSlot.end
                              )}`
                            : "Not scheduled"}
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span className="detail-label">
                          ⏱️ Duration
                        </span>

                        <strong>
                          {interview.duration} minutes
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span className="detail-label">
                          🌍 Timezone
                        </span>

                        <strong>
                          {interview.timezone}
                        </strong>

                      </div>

                    </div>


                    {/* ACTION */}

                    {interview.status === "confirmed" &&
                      interview.meetingLink && (

                        <div className="interview-actions">

                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="join-button"
                          >
                            🎥 Join Interview →
                          </a>

                        </div>

                    )}

                  </article>

                ))}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default InterviewerDashboard;