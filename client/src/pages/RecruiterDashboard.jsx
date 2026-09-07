import { useEffect, useState } from "react";
import api from "../services/api";

function RecruiterDashboard({
  user,
  onCreateInterview,
  onLogout
}) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rescheduleInterview, setRescheduleInterview] =
    useState(null);

  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("10:00");

  const [actionLoading, setActionLoading] = useState(false);

  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    loadInterviews();
    loadGoogleStatus();

    const params = new URLSearchParams(window.location.search);
    const googleStatus = params.get("google");

    if (googleStatus === "connected") {
      setGoogleConnected(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (googleStatus === "error") {
      setGoogleError("Google Calendar connection failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadGoogleStatus = async () => {
    try {
      const result = await api.get("/google/status");
      setGoogleConnected(Boolean(result.data?.connected));
    } catch (err) {
      console.error("Google Calendar status error:", err);
    }
  };

  const handleGoogleConnect = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError("");

      const result = await api.get("/google/auth-url");
      const authUrl = result.data?.url;

      if (!authUrl) {
        throw new Error("Google authorization URL was not returned");
      }

      window.location.href = authUrl;
    } catch (err) {
      setGoogleError(
        err.message || "Failed to connect Google Calendar"
      );
      setGoogleLoading(false);
    }
  };

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleCancel = async (interview) => {
    const confirmed = window.confirm(
      `Cancel "${interview.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await api.post(
        `/interviews/${interview._id}/cancel`
      );

      await loadInterviews();
    } catch (err) {
      setError(
        err.message || "Failed to cancel interview"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openReschedule = (interview) => {
    setRescheduleInterview(interview);

    if (interview.selectedSlot) {
      const start = new Date(
        interview.selectedSlot.start
      );

      const end = new Date(
        interview.selectedSlot.end
      );

      const localDate = [
        start.getFullYear(),
        String(start.getMonth() + 1).padStart(2, "0"),
        String(start.getDate()).padStart(2, "0")
      ].join("-");

      const localStart =
        `${String(start.getHours()).padStart(2, "0")}:${String(
          start.getMinutes()
        ).padStart(2, "0")}`;

      const localEnd =
        `${String(end.getHours()).padStart(2, "0")}:${String(
          end.getMinutes()
        ).padStart(2, "0")}`;

      setNewDate(localDate);
      setNewStart(localStart);
      setNewEnd(localEnd);
    }
  };

  const handleReschedule = async (event) => {
    event.preventDefault();

    if (!rescheduleInterview || !newDate) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const start = new Date(
        `${newDate}T${newStart}:00`
      ).toISOString();

      const end = new Date(
        `${newDate}T${newEnd}:00`
      ).toISOString();

      await api.post(
        `/interviews/${rescheduleInterview._id}/reschedule`,
        {
          start,
          end
        }
      );

      setRescheduleInterview(null);

      await loadInterviews();
    } catch (err) {
      setError(
        err.message ||
          "Failed to reschedule interview"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="recruiter-dashboard">

      <header className="recruiter-header">

        <div className="recruiter-brand">
          <div className="brand-mark">
            IS
          </div>

          <div>
            <h2>Interviewly</h2>
            <span>Recruiter Portal</span>
          </div>
        </div>

        <div className="recruiter-user">

          <div className="recruiter-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "R"}
          </div>

          <div className="recruiter-user-info">
            <strong>
              {user?.name || "Recruiter"}
            </strong>

            <span>
              {user?.email}
            </span>
          </div>

          <button
            className="recruiter-logout"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="recruiter-main">

        <section className="recruiter-welcome">

          <div>
            <p className="eyebrow">
  🧑‍💼 Recruiter workspace
</p>

            <h1>
              Good morning,{" "}
              {user?.name?.split(" ")[0] ||
                "Recruiter"} 👋
            </h1>

            <p>
              Manage your interviews and
              scheduling.
            </p>
          </div>

          <div className="recruiter-header-actions">
            <button
              className="create-interview-button"
              onClick={onCreateInterview}
            >
              ➕ Create Interview
            </button>

            <button
              type="button"
              className="calendar-connect-button"
              onClick={handleGoogleConnect}
              disabled={googleLoading || googleConnected}
            >
              {googleLoading
                ? "Connecting..."
                : googleConnected
                  ? "✓ Google Calendar Connected"
                  : "📅 Connect Google Calendar"}
            </button>
          </div>

        </section>

        <section className="recruiter-stats">

          <div className="recruiter-stat-card">
            <span>
              📋 Total Interviews
            </span>

            <strong>
              {interviews.length}
            </strong>
          </div>

          <div className="recruiter-stat-card">
            <span>
              ✅ Confirmed
            </span>

            <strong>
              {
                interviews.filter(
                  (item) =>
                    item.status === "confirmed"
                ).length
              }
            </strong>
          </div>

          <div className="recruiter-stat-card">
            <span>
              ❌ Cancelled
            </span>

            <strong>
              {
                interviews.filter(
                  (item) =>
                    item.status === "cancelled"
                ).length
              }
            </strong>
          </div>

        </section>

        <section>

          <div className="section-heading">
            <h2>
              Interviews
            </h2>

            <h1>
  Manage your interviews 🚀
</h1>
          </div>

          {error && (
            <div className="candidate-error">
              {error}
            </div>
          )}

          {googleError && (
            <div className="candidate-error">
              {googleError}
            </div>
          )}

          {loading ? (
            <div className="candidate-empty">
              <p>
                Loading interviews...
              </p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="candidate-empty">

              <div className="empty-icon">
                📅
              </div>

              <h3>
                No interviews yet
              </h3>

              <p>
                Create your first interview
                to get started.
              </p>

            </div>
          ) : (
            <div className="recruiter-interview-list">

              {interviews.map((interview) => {

                const slot =
                  interview.selectedSlot;

                return (
                  <div
                    className="recruiter-interview-card"
                    key={interview._id}
                  >

                    <div className="recruiter-card-top">

                      <div className="recruiter-card-icon">
                        {interview.interviewType ===
                        "technical"
                          ? "⌘"
                          : "◆"}
                      </div>

                      <div className="recruiter-card-title">

                        <span>
                          {interview.interviewType}
                        </span>

                        <h3>
                          {interview.title}
                        </h3>

                      </div>

                      <span className="recruiter-status">
                        {interview.status}
                      </span>

                    </div>

                    <div className="recruiter-card-details">

                      <div>
                        <small>
                          Candidate
                        </small>

                        <strong>
                          {interview.candidate?.name ||
                            "Candidate"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Date
                        </small>

                        <strong>
                          {slot
                            ? formatDate(
                                slot.start
                              )
                            : "Not scheduled"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Time
                        </small>

                        <strong>
                          {slot
                            ? `${formatTime(
                                slot.start
                              )} – ${formatTime(
                                slot.end
                              )}`
                            : "Not scheduled"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Duration
                        </small>

                        <strong>
                          {interview.duration} min
                        </strong>
                      </div>

                    </div>

                    {interview.status ===
                      "confirmed" && (
                      <div className="recruiter-card-footer">

                        <button
                          className="secondary-action"
                          onClick={() =>
                            openReschedule(
                              interview
                            )
                          }
                          disabled={
                            actionLoading
                          }
                        >
                          Reschedule
                        </button>

                        <button
                          className="danger-action"
                          onClick={() =>
                            handleCancel(
                              interview
                            )
                          }
                          disabled={
                            actionLoading
                          }
                        >
                          Cancel
                        </button>

                        {interview.meetingLink && (
                          <a
                            className="join-button"
                            href={
                              interview.meetingLink
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Join →
                          </a>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </main>

      {rescheduleInterview && (
        <div className="modal-overlay">

          <div className="reschedule-modal">

            <button
              className="modal-close"
              onClick={() =>
                setRescheduleInterview(null)
              }
            >
              ×
            </button>

            <span className="eyebrow">
              RESCHEDULE
            </span>

            <h2>
              Choose a new time
            </h2>

            <p>
              {rescheduleInterview.title}
            </p>

            <form
              onSubmit={handleReschedule}
            >

              <div className="form-group">
                <label>
                  New Date
                </label>

                <input
                  type="date"
                  value={newDate}
                  onChange={(e) =>
                    setNewDate(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="reschedule-time-grid">

                <div className="form-group">
                  <label>
                    Start
                  </label>

                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) =>
                      setNewStart(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    End
                  </label>

                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) =>
                      setNewEnd(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Rescheduling..."
                  : "Confirm New Time"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default RecruiterDashboard;