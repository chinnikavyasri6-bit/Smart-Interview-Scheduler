import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Lock, Mail, ArrowRight } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      login(response.data.data);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="brand-logo">
          <CalendarDays size={24} />
        </div>

        <div>
          <p className="brand-name">Smart Interview</p>
          <p className="brand-subtitle">Scheduler</p>
        </div>

        <div className="brand-content">
          <p className="eyebrow">INTERVIEW INTELLIGENCE</p>

          <h1>
            Stop scheduling.
            <br />
            Start interviewing.
          </h1>

          <p>
            Coordinate candidates, recruiters and interview
            panels with intelligent scheduling.
          </p>
        </div>

        <div className="brand-footer">
          <span>✓ Smart slot detection</span>
          <span>✓ Time-zone aware</span>
          <span>✓ Conflict prevention</span>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="mobile-brand">
            <div className="brand-logo">
              <CalendarDays size={22} />
            </div>
            <span>Smart Interview</span>
          </div>

          <div className="form-heading">
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to your workspace</h2>
            <p>
              Enter your credentials to continue.
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Email address</label>

            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;