import { useEffect, useState } from "react";
import api from "../services/api";

function CreateInterview({
  user,
  onBack,
  onComplete
}) {
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [candidate, setCandidate] = useState("");
  const [interviewers, setInterviewers] = useState([]);
  const [duration, setDuration] = useState(60);
  const [interviewType, setInterviewType] =
    useState("technical");
  const [timezone, setTimezone] =
    useState(
      user?.timezone || "Asia/Kolkata"
    );
  const [notes, setNotes] = useState("");

  const [date, setDate] = useState("");
  const [fromTime, setFromTime] =
    useState("09:00");
  const [toTime, setToTime] =
    useState("17:00");

  const [loadingUsers, setLoadingUsers] =
    useState(true);
  const [creating, setCreating] =
    useState(false);
  const [scheduling, setScheduling] =
    useState(false);

  const [interview, setInterview] =
    useState(null);

  const [slots, setSlots] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const [confirmedInterview, setConfirmedInterview] =
    useState(null);

  const [confirmingSlot, setConfirmingSlot] =
    useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");

      const result = await api.get("/users");

      const allUsers = Array.isArray(result.data)
        ? result.data
        : [];

      setUsers(allUsers);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load candidates and interviewers"
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const candidates = users.filter(
    (u) => u.role === "candidate"
  );

  const availableInterviewers =
    users.filter(
      (u) => u.role === "interviewer"
    );

  const handleInterviewerChange = (
    interviewerId
  ) => {
    setInterviewers((current) => {
      if (current.includes(interviewerId)) {
        return current.filter(
          (id) => id !== interviewerId
        );
      }

      return [
        ...current,
        interviewerId
      ];
    });
  };

  const handleCreateInterview = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!candidate) {
      setError(
        "Please select a candidate."
      );
      return;
    }

    if (interviewers.length === 0) {
      setError(
        "Please select at least one interviewer."
      );
      return;
    }

    if (!title.trim()) {
      setError("Please enter an interview title.");
      return;
    }

    try {
      setCreating(true);

      const result =
        await api.post(
          "/interviews",
          {
            title,
            candidate,
            interviewers,
            duration: Number(duration),
            interviewType,
            timezone,
            notes
          }
        );

      const createdInterview =
        result.data;

      setInterview(createdInterview);

      setSuccess(
        "Interview created successfully. Now find the best available slots."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to create interview"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleFindSlots = async () => {
    setError("");
    setSuccess("");
    setSlots([]);

    if (!interview) {
      setError(
        "Create the interview first."
      );
      return;
    }

    if (!date) {
      setError(
        "Please select an interview date."
      );
      return;
    }

    if (!fromTime || !toTime) {
      setError(
        "Please select both start and end times."
      );
      return;
    }

    if (toTime <= fromTime) {
      setError(
        "Available Until must be later than Available From."
      );
      return;
    }

    try {
      setScheduling(true);

      const start =
        new Date(
          `${date}T${fromTime}:00`
        ).toISOString();

      const end =
        new Date(
          `${date}T${toTime}:00`
        ).toISOString();

      const result =
        await api.post(
          `/interviews/${interview._id}/schedule`,
          {
            start,
            end
          }
        );

      const data = result.data || {};

      const rankedSlots =
        data.rankedSlots ||
        data.slots ||
        data.validSlots ||
        [];

      setSlots(rankedSlots);

      if (rankedSlots.length === 0) {
        setError(
          "No suitable interview slots were found for this period."
        );
      } else {
        setSuccess(
          `${rankedSlots.length} suitable slots found.`
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to find interview slots"
      );
    } finally {
      setScheduling(false);
    }
  };

  const handleConfirmSlot = async (
    slot
  ) => {
    if (!slot?.start || !slot?.end || confirmingSlot) {
      return;
    }

    const confirmed =
      window.confirm(
        `Confirm this interview slot?\\n\\n${formatSlot(
          slot.start
        )}`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setConfirmingSlot(slot.start);

    try {
      const result =
        await api.post(
          `/interviews/${interview._id}/confirm`,
          {
            start: new Date(
              slot.start
            ).toISOString(),

            end: new Date(
              slot.end
            ).toISOString()
          }
        );

      const confirmedInterviewData =
        result.data;

      setConfirmedInterview(
        confirmedInterviewData
      );

      setSuccess(
        "Interview confirmed successfully!"
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to confirm interview"
      );
    } finally {
      setConfirmingSlot(null);
    }
  };

  const formatSlot = (value) => {
    return new Date(value).toLocaleString(
      [],
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <h1>
            Create Interview
          </h1>

          <p>
            Create an interview and let the
            scheduler find the best time.
          </p>
        </div>

      </div>

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {!interview && (
        <form
          className="interview-form"
          onSubmit={
            handleCreateInterview
          }
        >

          <div className="form-section">

            <h2>
              Interview Details
            </h2>

            <div className="form-grid">

              <div className="form-group full">
                <label>
                  Interview Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Software Engineer Technical Interview"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Candidate
                </label>

                <select
                  value={candidate}
                  onChange={(e) =>
                    setCandidate(
                      e.target.value
                    )
                  }
                  disabled={loadingUsers}
                  required
                >
                  <option value="">
                    {loadingUsers
                      ? "Loading candidates..."
                      : candidates.length === 0
                      ? "No candidates found"
                      : "Select candidate"}
                  </option>

                  {candidates.map(
                    (user) => (
                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.name} —{" "}
                        {user.email}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Interview Type
                </label>

                <select
                  value={interviewType}
                  onChange={(e) =>
                    setInterviewType(
                      e.target.value
                    )
                  }
                >
                  <option value="technical">
                    Technical
                  </option>

                  <option value="hr">
                    HR
                  </option>

                  <option value="managerial">
                    Managerial
                  </option>

                  <option value="behavioral">
                    Behavioral
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Duration
                </label>

                <select
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >
                  <option value="30">
                    30 minutes
                  </option>

                  <option value="45">
                    45 minutes
                  </option>

                  <option value="60">
                    60 minutes
                  </option>

                  <option value="90">
                    90 minutes
                  </option>

                  <option value="120">
                    120 minutes
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Timezone
                </label>

                <select
                  value={timezone}
                  onChange={(e) =>
                    setTimezone(
                      e.target.value
                    )
                  }
                >
                  <option value="Asia/Kolkata">
                    Asia/Kolkata
                  </option>

                  <option value="UTC">
                    UTC
                  </option>

                  <option value="America/New_York">
                    America/New_York
                  </option>

                  <option value="Europe/London">
                    Europe/London
                  </option>

                  <option value="Asia/Singapore">
                    Asia/Singapore
                  </option>
                </select>
              </div>

            </div>

          </div>

          <div className="form-section">

            <h2>
              Interview Panel
            </h2>

            <p className="section-description">
              Select the interviewer or
              interviewers who should participate.
            </p>

            <div className="interviewer-list">

              {loadingUsers ? (
                <p className="section-description">
                  Loading interviewers...
                </p>
              ) : availableInterviewers.length === 0 ? (
                <p className="section-description">
                  No interviewers are available yet.
                </p>
              ) : (
                availableInterviewers.map(
                  (interviewer) => (
                    <label
                      className="interviewer-option"
                      key={
                        interviewer._id
                      }
                    >
                      <input
                        type="checkbox"
                        checked={interviewers.includes(
                          interviewer._id
                        )}
                        onChange={() =>
                          handleInterviewerChange(
                            interviewer._id
                          )
                        }
                      />

                      <span>
                        <strong>
                          {interviewer.name}
                        </strong>

                        <small>
                          {interviewer.email}
                        </small>
                      </span>
                    </label>
                  )
                )
              )}

            </div>

          </div>

          <div className="form-section">

            <h2>
              Additional Notes
            </h2>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Add interview instructions or notes..."
              rows="4"
            />

          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={
              creating ||
              loadingUsers
            }
          >
            {creating
              ? "Creating..."
              : "Create Interview"}
          </button>

        </form>
      )}

      {interview && !confirmedInterview && (
        <div className="scheduler-panel">

          <div className="created-card">

            <div>
              <span className="status-badge">
                Created
              </span>

              <h2>
                {interview.title}
              </h2>

              <p>
                {interview.duration} minute{" "}
                {interview.interviewType} interview
              </p>
            </div>

          </div>

          <div className="form-section">

            <h2>
              Find Best Interview Slots
            </h2>

            <p className="section-description">
              The scheduling engine will check
              participant availability, working
              hours and calendar conflicts.
            </p>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Available From
                </label>

                <input
                  type="time"
                  value={fromTime}
                  onChange={(e) =>
                    setFromTime(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Available Until
                </label>

                <input
                  type="time"
                  value={toTime}
                  onChange={(e) =>
                    setToTime(
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            <button
              className="primary-button"
              onClick={
                handleFindSlots
              }
              disabled={scheduling}
            >
              {scheduling
                ? "Finding Best Slots..."
                : "Find Best Slots"}
            </button>

          </div>

          {slots.length > 0 && (
            <div className="slots-section">

              <h2>
                Recommended Slots
              </h2>

              <p className="section-description">
                Slots are ranked by the scheduling
                engine.
              </p>

              <div className="slot-list">

                {slots.map(
                  (slot, index) => (
                    <div
                      className="slot-card"
                      key={`${slot.start}-${index}`}
                    >

                      <div className="slot-rank">
                        #{index + 1}
                      </div>

                      <div className="slot-info">

                        <strong>
                          {formatSlot(
                            slot.start
                          )}
                        </strong>

                        <span>
                          Until{" "}
                          {new Date(
                            slot.end
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )}
                        </span>

                      </div>

                      <div className="slot-score">
                        Score{" "}
                        {slot.score ?? "—"}
                      </div>

                      <button
                        className="confirm-button"
                        onClick={() =>
                          handleConfirmSlot(
                            slot
                          )
                        }
                        disabled={
                          confirmingSlot !== null
                        }
                      >
                        {confirmingSlot === slot.start
                          ? "Confirming..."
                          : "Confirm"}
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>
      )}

      {confirmedInterview && (
        <div className="confirmed-card">

          <div className="success-icon">
            ✓
          </div>

          <span className="status-badge confirmed">
            Confirmed
          </span>

          <h2>
            Interview Scheduled!
          </h2>

          <p>
            {confirmedInterview.interview
              ?.title ||
              interview.title}
          </p>

          {confirmedInterview.interview
            ?.selectedSlot && (
            <p>
              {formatSlot(
                confirmedInterview
                  .interview
                  .selectedSlot.start
              )}
            </p>
          )}

          {(confirmedInterview.meetingLink ||
            confirmedInterview.interview
              ?.meetingLink) && (
            <a
              className="meeting-link"
              href={
                confirmedInterview.meetingLink ||
                confirmedInterview.interview
                  ?.meetingLink
              }
              target="_blank"
              rel="noreferrer"
            >
              Join Interview →
            </a>
          )}

          <button
            className="primary-button"
            onClick={onComplete}
          >
            Back to Dashboard
          </button>

        </div>
      )}

    </div>
  );
}

export default CreateInterview;