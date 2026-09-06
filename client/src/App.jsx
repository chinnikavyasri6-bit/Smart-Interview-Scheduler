import { useState } from "react";
import "./App.css";
import api from "./services/api";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateInterview from "./pages/CreateInterview";
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import Availability from "./pages/Availability";

function App() {
  const [page, setPage] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      return "dashboard";
    }

    return "landing";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [showLoginPassword, setShowLoginPassword] =
    useState(false);

  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    timezone: "Asia/Kolkata"
  });

  /* =========================
     INPUT HANDLERS
  ========================= */

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value
    });

    setAuthError("");
  };

  const handleRegisterChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value
    });

    setAuthError("");
  };

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = async (event) => {
    event.preventDefault();

    setAuthError("");
    setAuthLoading(true);

    try {
      const result = await api.post(
        "/auth/login",
        loginData
      );

      const token = result.data.token;
      const loggedInUser = result.data.user;

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);
      setPage("dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setAuthError(
        error.message || "Login failed"
      );
    } finally {
      setAuthLoading(false);
    }
  };

  /* =========================
     REGISTER
  ========================= */

  const handleRegister = async (event) => {
    event.preventDefault();

    setAuthError("");
    setAuthLoading(true);

    try {
      const result = await api.post(
        "/auth/register",
        {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          timezone: registerData.timezone,
          workingHours: {
            start: "09:00",
            end: "17:00"
          }
        }
      );

      const token = result.data.token;
      const registeredUser = result.data.user;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(registeredUser)
      );

      setUser(registeredUser);
      setPage("dashboard");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setAuthError(
        error.message || "Registration failed"
      );
    } finally {
      setAuthLoading(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setAuthError("");

    setPage("landing");
  };

  /* =====================================================
     IMPORTANT:
     CREATE INTERVIEW MUST COME BEFORE DASHBOARD.
  ===================================================== */

  if (
    user?.role === "recruiter" &&
    page === "create-interview"
  ) {
    return (
      <CreateInterview
        user={user}
        onBack={() => setPage("dashboard")}
        onComplete={() => setPage("dashboard")}
      />
    );
  }

  /* =========================
     LANDING PAGE
  ========================= */

  if (page === "landing") {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">

            <div className="logo-icon">
              ⏱
            </div>

            Interviewly

          </div>

          <button
            className="nav-login"
            onClick={() => {
              setAuthError("");
              setPage("login");
            }}
          >
            Login
          </button>

        </nav>


        <section className="hero">

          <div className="badge">
            ✦ Intelligent Interview Scheduling
          </div>


          <h1>
            Interviews,
            <br />

            <span className="gradient-text">
              perfectly scheduled.
            </span>
          </h1>


          <p>
            Coordinate candidates, recruiters and
            interviewers effortlessly. Find the best
            time, avoid conflicts and keep every
            interview on track.
          </p>


          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => {
                setAuthError("");
                setPage("register");
              }}
            >
              Get Started →
            </button>


            <button
              className="secondary-btn"
              onClick={() => {
                setAuthError("");
                setPage("login");
              }}
            >
              Sign In
            </button>

          </div>

        </section>


        <section className="features">

          <div className="feature-card">

            <div className="feature-icon">
              ⚡
            </div>

            <h3>
              Smart Scheduling
            </h3>

            <p>
              Automatically find the best interview
              slots based on everyone's availability.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🌍
            </div>

            <h3>
              Timezone Aware
            </h3>

            <p>
              Coordinate teams across different
              timezones without confusing time
              conversions.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🛡
            </div>

            <h3>
              Conflict Detection
            </h3>

            <p>
              Detect scheduling conflicts before
              an interview is confirmed.
            </p>

          </div>

        </section>


        <section className="roles">

          <div className="section-title">

            <h2>
              One platform. Every participant.
            </h2>

            <p>
              Designed around the people involved
              in every interview.
            </p>

          </div>


          <div className="role-grid">

            <div className="role-card">

              <h3>
                👩‍💼 Recruiter
              </h3>

              <p>
                Create interviews, coordinate
                participants, discover optimal slots
                and manage the complete interview
                lifecycle.
              </p>

            </div>


            <div className="role-card">

              <h3>
                👨‍💻 Candidate
              </h3>

              <p>
                Share availability, review proposed
                slots, confirm interviews and join
                meetings easily.
              </p>

            </div>


            <div className="role-card">

              <h3>
                🎯 Interviewer
              </h3>

              <p>
                Manage availability, view assigned
                interviews and stay organized with
                a unified schedule.
              </p>

            </div>

          </div>

        </section>


        <footer className="footer">
          Smart Interview Scheduler • Built for smarter hiring
        </footer>

      </div>
    );
  }


  /* =========================
     LOGIN PAGE
  ========================= */

  if (page === "login") {
    return (
      <div className="auth-page">

        <div className="auth-brand">

          <button
            className="back-button"
            onClick={() => {
              setAuthError("");
              setPage("landing");
            }}
          >
            ← Back
          </button>


          <div className="auth-brand-content">

            <div className="large-logo">
              ⏱
            </div>


            <h1>
              Welcome back to
              <span>
                {" "}
                Interviewly
              </span>
            </h1>


            <p>
              Your interviews are waiting. Sign in
              to manage your schedule, availability
              and upcoming interviews.
            </p>


            <div className="auth-highlight">

              <div>
                ✓
              </div>

              <span>
                Smart scheduling
              </span>

            </div>


            <div className="auth-highlight">

              <div>
                ✓
              </div>

              <span>
                Automatic conflict detection
              </span>

            </div>


            <div className="auth-highlight">

              <div>
                ✓
              </div>

              <span>
                Timezone-aware coordination
              </span>

            </div>

          </div>

        </div>


        <div className="auth-form-container">

          <form
            className="auth-form"
            onSubmit={handleLogin}
          >

            <div className="form-heading">

              <span>
                ACCOUNT
              </span>

              <h2>
                Sign in
              </h2>

              <p>
                Enter your credentials to continue.
              </p>

            </div>


            <label>
              Email address
            </label>


            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />


            <label>
              Password
            </label>


            <div className="password-wrapper">

              <input
                type={
                  showLoginPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowLoginPassword(
                    !showLoginPassword
                  )
                }
                aria-label={
                  showLoginPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showLoginPassword
                  ? "🙈"
                  : "👁"}
              </button>

            </div>


            {authError && (
              <div className="login-error">
                {authError}
              </div>
            )}


            <button
              type="submit"
              className="auth-submit"
              disabled={authLoading}
            >
              {authLoading
                ? "Signing in..."
                : "Sign in →"}
            </button>


            <div className="form-switch">

              Don't have an account?

              <button
                type="button"
                onClick={() => {
                  setAuthError("");
                  setPage("register");
                }}
              >
                Create one
              </button>

            </div>

          </form>

        </div>

      </div>
    );
  }


  /* =========================
   RECRUITER DASHBOARD
========================= */

if (
  page === "dashboard" &&
  user?.role === "recruiter"
) {
  return (
    <RecruiterDashboard
      user={user}
      onCreateInterview={() =>
        setPage("create-interview")
      }
      onLogout={handleLogout}
    />
  );
}

if (
  page === "dashboard" &&
  user?.role === "candidate"
) {
  return (
    <CandidateDashboard
  user={user}
  onLogout={handleLogout}
  onAvailability={() =>
    setPage("availability")
  }
/>
  );
}

if (
  page === "dashboard" &&
  user?.role === "interviewer"
) {
  return (
    <InterviewerDashboard
  user={user}
  onLogout={handleLogout}
  onAvailability={() =>
    setPage("availability")
  }
/>
  );
}

  /* =========================
     AVAILABILITY PAGE
  ========================= */

  if (page === "availability") {
    return (
      <Availability
        user={user}
        onBack={() => setPage("dashboard")}
        onLogout={handleLogout}
      />
    );
  }


  /* =========================
     CANDIDATE / INTERVIEWER
     DASHBOARD
  ========================= */

  if (page === "dashboard") {

    const role = user?.role;

    const roleName =
      role === "candidate"
        ? "Candidate"
        : "Interviewer";


    const dashboardTitle =
      role === "candidate"
        ? "Your interview journey"
        : "Your interview schedule";


    const dashboardDescription =
      role === "candidate"
        ? "View your upcoming interviews, manage availability and stay prepared."
        : "View assigned interviews, manage your availability and keep your schedule organized.";


    return (
      <div className="dashboard-layout">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="sidebar-logo">

            <div className="sidebar-logo-icon">
              ⏱
            </div>

            <span>
              Interviewly
            </span>

          </div>


          <div className="sidebar-role">

            <span className="sidebar-role-dot"></span>

            {roleName}

          </div>


          <nav className="sidebar-nav">

            <button
              className="sidebar-item active"
              onClick={() =>
                setPage("dashboard")
              }
            >
              <span>
                ⌂
              </span>

              Dashboard
            </button>


            <button className="sidebar-item">
              <span>
                ▣
              </span>

              Interviews
            </button>


            <button className="sidebar-item">
              <span>
                ◷
              </span>

              Availability
            </button>


            <button className="sidebar-item">
              <span>
                ▤
              </span>

              Calendar
            </button>

          </nav>


          <div className="sidebar-bottom">

            <div className="sidebar-user">

              <div className="user-avatar">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>


              <div className="sidebar-user-info">

                <strong>
                  {user?.name}
                </strong>

                <span>
                  {user?.email}
                </span>

              </div>

            </div>


            <button
              className="logout-button"
              onClick={handleLogout}
            >
              ↪

              <span>
                Logout
              </span>

            </button>

          </div>

        </aside>


        {/* MAIN CONTENT */}

        <main className="dashboard-main">

          <header className="dashboard-header">

            <div>

              <p className="dashboard-eyebrow">
                {roleName.toUpperCase()} DASHBOARD
              </p>

              <h1>
                {dashboardTitle}
              </h1>

              <p className="dashboard-description">
                {dashboardDescription}
              </p>

            </div>


            <div className="header-user">

              <div className="header-avatar">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>


              <div>

                <strong>
                  {user?.name}
                </strong>

                <span>
                  {roleName}
                </span>

              </div>

            </div>

          </header>


          {/* CANDIDATE */}

          {role === "candidate" && (
            <>

              <div className="dashboard-actions">

                <button className="dashboard-primary-button">
                  + Add Availability
                </button>

                <button className="dashboard-secondary-button">
                  View Calendar
                </button>

              </div>


              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon purple">
                    ◫
                  </div>

                  <div>

                    <span>
                      Interviews
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon blue">
                    ◷
                  </div>

                  <div>

                    <span>
                      Upcoming
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon green">
                    ✓
                  </div>

                  <div>

                    <span>
                      Confirmed
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon orange">
                    ◉
                  </div>

                  <div>

                    <span>
                      Availability
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>

              </div>


              <section className="dashboard-section">

                <div className="section-heading-row">

                  <div>

                    <h2>
                      Upcoming interviews
                    </h2>

                    <p>
                      Interviews scheduled with you
                    </p>

                  </div>

                </div>


                <div className="empty-dashboard">

                  <div className="empty-icon">
                    ◷
                  </div>

                  <h3>
                    Your schedule is clear
                  </h3>

                  <p>
                    When a recruiter schedules an
                    interview, it will appear here.
                  </p>

                </div>

              </section>

            </>
          )}


          {/* INTERVIEWER */}

          {role === "interviewer" && (
            <>

              <div className="dashboard-actions">

                <button className="dashboard-primary-button">
                  + Set Availability
                </button>

                <button className="dashboard-secondary-button">
                  View Calendar
                </button>

              </div>


              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon purple">
                    ◫
                  </div>

                  <div>

                    <span>
                      Assigned
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon blue">
                    ◷
                  </div>

                  <div>

                    <span>
                      Upcoming
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon green">
                    ✓
                  </div>

                  <div>

                    <span>
                      Confirmed
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon orange">
                    ◉
                  </div>

                  <div>

                    <span>
                      Availability
                    </span>

                    <strong>
                      0
                    </strong>

                  </div>

                </div>

              </div>


              <section className="dashboard-section">

                <div className="section-heading-row">

                  <div>

                    <h2>
                      Assigned interviews
                    </h2>

                    <p>
                      Interviews you are scheduled to conduct
                    </p>

                  </div>

                </div>


                <div className="empty-dashboard">

                  <div className="empty-icon">
                    ◫
                  </div>

                  <h3>
                    No assigned interviews
                  </h3>

                  <p>
                    Interviews assigned to you will
                    appear here.
                  </p>

                </div>

              </section>

            </>
          )}

        </main>

      </div>
    );
  }


  /* =========================
     REGISTER PAGE
  ========================= */

  return (
    <div className="auth-page">

      <div className="auth-brand">

        <button
          className="back-button"
          onClick={() => {
            setAuthError("");
            setPage("landing");
          }}
        >
          ← Back
        </button>


        <div className="auth-brand-content">

          <div className="large-logo">
            ⏱
          </div>


          <h1>
            Build a better
            <span>
              {" "}
              interview experience.
            </span>
          </h1>


          <p>
            Join Interviewly and make interview
            coordination simpler for everyone
            involved.
          </p>


          <div className="mini-stat">

            <strong>
              3
            </strong>

            <span>
              participant roles
            </span>

          </div>


          <div className="mini-stat">

            <strong>
              24/7
            </strong>

            <span>
              schedule visibility
            </span>

          </div>

        </div>

      </div>


      <div className="auth-form-container">

        <form
          className="auth-form register-form"
          onSubmit={handleRegister}
        >

          <div className="form-heading">

            <span>
              GET STARTED
            </span>

            <h2>
              Create account
            </h2>

            <p>
              Tell us a little about yourself.
            </p>

          </div>


          <label>
            Full name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={registerData.name}
            onChange={handleRegisterChange}
            required
          />


          <label>
            Email address
          </label>

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />


          <label>
            Password
          </label>


          <div className="password-wrapper">

            <input
              type={
                showRegisterPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="At least 6 characters"
              value={registerData.password}
              onChange={handleRegisterChange}
              minLength="6"
              required
            />


            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowRegisterPassword(
                  !showRegisterPassword
                )
              }
              aria-label={
                showRegisterPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showRegisterPassword
                ? "🙈"
                : "👁"}
            </button>

          </div>


          <label>
            I am joining as
          </label>


          <div className="role-select">

            <button
              type="button"
              className={
                registerData.role === "candidate"
                  ? "role-option active"
                  : "role-option"
              }
              onClick={() =>
                setRegisterData({
                  ...registerData,
                  role: "candidate"
                })
              }
            >

              <span>
                👨‍💻
              </span>

              <strong>
                Candidate
              </strong>

              <small>
                I'm attending interviews
              </small>

            </button>


            <button
              type="button"
              className={
                registerData.role === "recruiter"
                  ? "role-option active"
                  : "role-option"
              }
              onClick={() =>
                setRegisterData({
                  ...registerData,
                  role: "recruiter"
                })
              }
            >

              <span>
                👩‍💼
              </span>

              <strong>
                Recruiter
              </strong>

              <small>
                I'm scheduling interviews
              </small>

            </button>


            <button
              type="button"
              className={
                registerData.role === "interviewer"
                  ? "role-option active"
                  : "role-option"
              }
              onClick={() =>
                setRegisterData({
                  ...registerData,
                  role: "interviewer"
                })
              }
            >

              <span>
                🎯
              </span>

              <strong>
                Interviewer
              </strong>

              <small>
                I'm conducting interviews
              </small>

            </button>

          </div>


          {authError && (
            <div className="login-error">
              {authError}
            </div>
          )}


          <button
            type="submit"
            className="auth-submit"
            disabled={authLoading}
          >

            {authLoading
              ? "Creating account..."
              : "Create account →"}

          </button>


          <div className="form-switch">

            Already have an account?

            <button
              type="button"
              onClick={() => {
                setAuthError("");
                setPage("login");
              }}
            >
              Sign in
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default App;