import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  User,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    timezone: "Asia/Kolkata"
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
      const response = await api.post(
        "/auth/register",
        form
      );

      login(response.data.data);

      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed.";

      setError(message);
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
          <p className="eyebrow">BUILD YOUR WORKSPACE</p>

          <h1>
            Make every interview
            <br />
            count.
          </h1>

          <p>
            Bring your entire interview workflow into one
            intelligent workspace.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="form-heading">
            <p className="eyebrow">GET STARTED</p>

            <h2>Create your account</h2>

            <p>
              Set up your Smart Interview Scheduler workspace.
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Full name</label>

            <div className="input-wrapper">
              <User size={18} />

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <label>I am a</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
              <option value="interviewer">Interviewer</option>
            </select>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;