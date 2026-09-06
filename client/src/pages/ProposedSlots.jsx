import { useEffect, useState } from "react";
import api from "../services/api";

function ProposedSlots({ user, onBack, onLogout }) {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api.get("/interviews");

      const schedulingInterviews = (result.data || []).filter(
        (interview) =>
          interview.status === "scheduling" ||
          interview.status === "proposed"
      );

      setInterviews(schedulingInterviews);
    } catch (err) {
      setError(err.message || "Failed to load proposed interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadSlots = async (interview) => {
    try {
      setLoadingSlots(true);
      setError("");
      setSelectedInterview(interview);

      /*
       * We will connect this to the backend
       * slot API next.
       */
      const result = await api.get(
        `/interviews/${interview._id}/slots`
      );

      setSlots(
        result.data?.rankedSlots ||
        result.data?.slots ||
        result.data?.validSlots ||
        []
      );
    } catch (err) {
      setSlots([]);
      setError(err.message || "Failed to load proposed slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "Unknown date";

    return new Date(value).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="proposed-slots-page">

      {/* HEADER */}

      <header className="proposed-slots-header">
        <div className="availability-brand">
          <div className="brand-mark">IS</div>

          <div>
            <h2>SmartInterview</h2>
            <span>Candidate Portal</span>
          </div>
        </div>

        <div className="availability-user">
          <div className="availability-user-info">
            <strong>{user?.name || "Candidate"}</strong>
            <span>{user?.email}</span>
          </div>

          <button
            className="availability-header-button"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main className="proposed-slots-main">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <section className="proposed-slots-intro">

          <p className="eyebrow">
            ✨ SMART SCHEDULING
          </p>

          <h1>
            Choose your interview slot
          </h1>

          <p>
            We found the best available times based on
            your availability, interviewer availability,
            working hours and scheduling conflicts.
          </p>

        </section>

        {error && (
          <div className="availability-error">
            ⚠️ {error}
          </div>
        )}

        {/* INTERVIEW LIST */}

        <section className="proposed-interviews-section">

          <div className="section-heading">
            <div>
              <p className="eyebrow">
                📋 INTERVIEW REQUESTS
              </p>

              <h2>
                Interviews waiting for your response
              </h2>
            </div>

            <div className="availability-count">
              {interviews.length}
            </div>
          </div>

          {loading ? (
            <div className="availability-empty">
              ⏳ Loading interview requests...
            </div>
          ) : interviews.length === 0 ? (
            <div className="availability-empty">

              <div className="availability-empty-icon">
                🗓️
              </div>

              <h3>
                No proposed interviews
              </h3>

              <p>
                When a recruiter generates interview slots,
                they will appear here.
              </p>

            </div>
          ) : (
            <div className="proposed-interview-list">

              {interviews.map((interview) => (
                <div
                  className={`proposed-interview-card ${
                    selectedInterview?._id === interview._id
                      ? "selected"
                      : ""
                  }`}
                  key={interview._id}
                >

                  <div className="proposed-interview-top">

                    <div className="proposed-interview-icon">
                      {interview.interviewType === "technical"
                        ? "💻"
                        : interview.interviewType === "hr"
                        ? "🤝"
                        : "🎯"}
                    </div>

                    <div>
                      <span>
                        {interview.interviewType}
                      </span>

                      <h3>
                        {interview.title}
                      </h3>
                    </div>

                    <span className="proposed-status">
                      {interview.status}
                    </span>

                  </div>

                  <div className="proposed-interview-details">

                    <div>
                      <small>
                        Duration
                      </small>

                      <strong>
                        {interview.duration} minutes
                      </strong>
                    </div>

                    <div>
                      <small>
                        Timezone
                      </small>

                      <strong>
                        {interview.timezone}
                      </strong>
                    </div>

                  </div>

                  <button
                    className="view-slots-button"
                    onClick={() =>
                      loadSlots(interview)
                    }
                    disabled={loadingSlots}
                  >
                    {loadingSlots &&
                    selectedInterview?._id === interview._id
                      ? "⏳ Finding slots..."
                      : "✨ View Best Slots"}
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* SLOTS */}

        {selectedInterview && (
          <section className="slots-section">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  ⭐ RECOMMENDED SLOTS
                </p>

                <h2>
                  {selectedInterview.title}
                </h2>
              </div>

              <div className="availability-count">
                {slots.length}
              </div>

            </div>

            {loadingSlots ? (
              <div className="availability-empty">
                <div className="availability-empty-icon">
                  ⚙️
                </div>

                <h3>
                  Finding the best slots...
                </h3>

                <p>
                  Checking availability, conflicts,
                  working hours and time zones.
                </p>
              </div>
            ) : slots.length === 0 ? (
              <div className="availability-empty">

                <div className="availability-empty-icon">
                  😕
                </div>

                <h3>
                  No available slots
                </h3>

                <p>
                  There are currently no valid interview
                  slots based on the available schedules.
                </p>

              </div>
            ) : (
              <div className="slots-list">

                {slots.map((slot, index) => (

                  <div
                    className={`slot-card ${
                      index === 0
                        ? "recommended-slot"
                        : ""
                    }`}
                    key={`${slot.start}-${slot.end}-${index}`}
                  >

                    {index === 0 && (
                      <div className="recommended-label">
                        ⭐ Best Match
                      </div>
                    )}

                    <div className="slot-date">

                      <div className="slot-calendar-icon">
                        📅
                      </div>

                      <div>
                        <strong>
                          {formatDate(slot.start)}
                        </strong>

                        <span>
                          🕐 {formatTime(slot.start)}
                          {" – "}
                          {formatTime(slot.end)}
                        </span>
                      </div>

                    </div>

                    <div className="slot-score">

                      <small>
                        Match Score
                      </small>

                      <strong>
                        {slot.score ?? "—"}
                      </strong>

                    </div>

                    <button
                      className="choose-slot-button"
                      onClick={() => {
                        alert(
                          "Slot selection will be connected next."
                        );
                      }}
                    >
                      Choose this slot →
                    </button>

                  </div>

                ))}

              </div>
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default ProposedSlots;