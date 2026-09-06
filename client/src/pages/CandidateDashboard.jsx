import { useEffect, useState } from "react";
import api from "../services/api";

function CandidateDashboard({
  user,
  onLogout,
  onAvailability
}) {
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
      setError(
        err.message || "Failed to load interviews"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  const upcomingInterviews = interviews.filter(
    (interview) =>
      interview.status === "confirmed" &&
      interview.selectedSlot?.start &&
      new Date(interview.selectedSlot.start) >=
        new Date()
  );

  const completedInterviews = interviews.filter(
    (interview) =>
      interview.status === "completed"
  );

  const cancelledInterviews = interviews.filter(
    (interview) =>
      interview.status === "cancelled"
  );

  const getInterviewIcon = (type) => {
    switch (type) {
      case "technical":
        return "💻";

      case "hr":
        return "🤝";

      case "managerial":
        return "👔";

      case "behavioral":
        return "🧠";

      default:
        return "🎯";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✓";

      case "cancelled":
        return "×";

      case "completed":
        return "✓";

      case "proposed":
        return "◆";

      case "scheduling":
        return "◌";

      case "rescheduling":
        return "↻";

      default:
        return "•";
    }
  };

  return (
    <div className="candidate-dashboard">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="dashboard-header">

        <div>

          <div className="brand">
            Smart<span>Interview</span>
          </div>

          <p className="dashboard-subtitle">
            Candidate Portal
          </p>

        </div>


        <div className="header-actions">

          <div className="user-info">

            <strong>
              {user?.name || "Candidate"}
            </strong>

            <span>
              {user?.email}
            </span>

          </div>


          {/* AVAILABILITY */}

          <button
            className="dashboard-secondary-button"
            onClick={onAvailability}
          >
            🕐 My Availability
          </button>


          {/* REFRESH */}

          <button
            className="secondary-button"
            onClick={loadInterviews}
            disabled={loading}
          >
            {loading
              ? "⏳ Loading..."
              : "🔄 Refresh"}
          </button>


          {/* LOGOUT */}

          <button
            className="logout-button"
            onClick={onLogout}
          >
            🚪 Logout
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="dashboard-main">

        {/* WELCOME */}

        <section className="welcome-section">

          <div>

            <p className="eyebrow">
              👋 Welcome back
            </p>

            <h1>
              Your interview journey 🚀
            </h1>

            <p>
              Keep track of your upcoming interviews,
              schedules and meeting details.
            </p>

          </div>

        </section>


        {/* =================================================
            STATS
            ================================================= */}

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
              📅 Upcoming
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


        {/* =================================================
            ERROR
            ================================================= */}

        {error && (

          <div className="error-message">
            ⚠️ {error}
          </div>

        )}


        {/* =================================================
            LOADING / INTERVIEWS
            ================================================= */}

        {loading ? (

          <div className="empty-state">

            <div className="empty-icon">
              ⏳
            </div>

            <p>
              Loading your interviews...
            </p>

          </div>

        ) : (

          <section className="interviews-section">

            {/* SECTION HEADING */}

            <div className="section-heading">

              <div>

                <p className="eyebrow">
                  📅 Schedule
                </p>

                <h2>
                  🎯 Your Interviews
                </h2>

              </div>

              <span className="count-badge">
                {interviews.length}
              </span>

            </div>


            {/* EMPTY */}

            {interviews.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  🗓️
                </div>

                <h3>
                  No interviews yet
                </h3>

                <p>
                  Your scheduled interviews will
                  appear here.
                </p>

                <button
                  className="dashboard-secondary-button"
                  onClick={onAvailability}
                >
                  🕐 Set My Availability
                </button>

              </div>

            ) : (

              /* INTERVIEW LIST */

              <div className="interview-list">

                {interviews.map(
                  (interview) => (

                    <article
                      className="interview-card"
                      key={interview._id}
                    >

                      {/* CARD HEADER */}

                      <div className="interview-card-top">

                        <div className="interview-title-area">

                          <div className="interview-type-icon">
                            {getInterviewIcon(
                              interview.interviewType
                            )}
                          </div>

                          <div>

                            <p className="interview-type">

                              {interview.interviewType ||
                                "Interview"}

                            </p>

                            <h3>
                              {interview.title}
                            </h3>

                          </div>

                        </div>


                        <span
                          className={`status-badge status-${interview.status}`}
                        >

                          {getStatusIcon(
                            interview.status
                          )}{" "}

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
                              interview
                                .selectedSlot
                                ?.start
                            )}
                          </strong>

                        </div>


                        <div className="detail-item">

                          <span className="detail-label">
                            🕐 Time
                          </span>

                          <strong>

                            {interview
                              .selectedSlot
                              ?.start

                              ? `${formatTime(
                                  interview
                                    .selectedSlot
                                    .start
                                )} - ${formatTime(
                                  interview
                                    .selectedSlot
                                    .end
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
                            {interview.timezone ||
                              "UTC"}
                          </strong>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      {interview.status ===
                        "confirmed" &&
                        interview.meetingLink && (

                          <div className="interview-actions">

                            <a
                              href={
                                interview.meetingLink
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="join-button"
                            >
                              🎥 Join Interview →
                            </a>

                          </div>

                        )}

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default CandidateDashboard;