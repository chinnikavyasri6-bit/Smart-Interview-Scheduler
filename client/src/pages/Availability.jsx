import { useEffect, useState } from "react";
import api from "../services/api";

function Availability({ user, onBack, onLogout }) {
  const [availabilities, setAvailabilities] = useState([]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api.get(
        `/availability/user/${user.id}`
      );

      setAvailabilities(result.data || []);
    } catch (err) {
      setError(
        err.message || "Failed to load availability"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvailability = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setSaving(true);

      const start = new Date(
        `${date}T${startTime}:00`
      ).toISOString();

      const end = new Date(
        `${date}T${endTime}:00`
      ).toISOString();

      await api.post("/availability", {
        start,
        end,
        timezone: user?.timezone || "UTC",
        source: "manual",
        status: "available"
      });

      setSuccess(
        "Availability added successfully! 🎉"
      );

      await loadAvailability();

      setDate("");
      setStartTime("09:00");
      setEndTime("17:00");
    } catch (err) {
      setError(
        err.message || "Failed to add availability"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (value) => {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="availability-page">

      {/* HEADER */}

      <header className="availability-header">

        <div className="availability-brand">
          <div className="brand-mark">
            IS
          </div>

          <div>
            <h2>SmartInterview</h2>
            <span>
              {user?.role === "candidate"
                ? "Candidate Portal"
                : "Interviewer Portal"}
            </span>
          </div>
        </div>

        <div className="availability-user">

          <div className="availability-user-info">
            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.email}
            </span>
          </div>

          <button
            type="button"
            className="availability-header-button"
            onClick={onLogout}
          >
            🚪 Logout
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="availability-main">

        {/* BACK BUTTON */}

        <button
          type="button"
          className="back-button"
          onClick={onBack}
          aria-label="Go back to dashboard"
        >
          ← Back to Dashboard
        </button>


        {/* INTRO */}

        <section className="availability-intro">

          <p className="eyebrow">
            🕐 AVAILABILITY
          </p>

          <h1>
            When are you available? 📅
          </h1>

          <p>
            Add the times when you are available
            for interviews. SmartInterview will use
            this information to find the best slot.
            ✨
          </p>

        </section>


        {/* FORM */}

        <section className="availability-form-card">

          <div className="availability-section-title">

            <div className="availability-section-icon">
              ➕
            </div>

            <div>
              <h2>
                Add Availability
              </h2>

              <p>
                Tell us when you are free.
              </p>
            </div>

          </div>


          <form
            onSubmit={handleAddAvailability}
            className="availability-form"
          >

            <div className="form-group">

              <label>
                📅 Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                required
              />

            </div>


            <div className="availability-time-row">

              <div className="form-group">

                <label>
                  🕐 Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  🕐 End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

            </div>


            <div className="availability-timezone">

              <span>
                🌍 Timezone
              </span>

              <strong>
                {user?.timezone || "UTC"}
              </strong>

            </div>


            {error && (
              <div className="availability-error">
                ⚠️ {error}
              </div>
            )}


            {success && (
              <div className="availability-success">
                ✅ {success}
              </div>
            )}


            <button
              className="availability-submit"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "⏳ Adding..."
                : "➕ Add Availability"}
            </button>

          </form>

        </section>


        {/* EXISTING AVAILABILITY */}

        <section className="availability-list-section">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                📋 YOUR SCHEDULE
              </p>

              <h2>
                Your Availability
              </h2>

            </div>

            <div className="availability-count">
              {availabilities.length}
            </div>

          </div>


          {loading ? (

            <div className="availability-empty">
              ⏳ Loading availability...
            </div>

          ) : availabilities.length === 0 ? (

            <div className="availability-empty">

              <div className="availability-empty-icon">
                🗓️
              </div>

              <h3>
                No availability added yet
              </h3>

              <p>
                Add your available interview times
                above to help us find the best slot.
              </p>

            </div>

          ) : (

            <div className="availability-list">

              {availabilities.map((item) => (

                <div
                  className="availability-item"
                  key={item._id}
                >

                  <div className="availability-item-icon">
                    📅
                  </div>

                  <div className="availability-item-info">

                    <strong>
                      {formatDate(item.start)}
                    </strong>

                    <span>
                      🕐 {formatTime(item.start)}
                      {" – "}
                      {formatTime(item.end)}
                    </span>

                  </div>

                  <div className="availability-status">
                    ✓ Available
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Availability;