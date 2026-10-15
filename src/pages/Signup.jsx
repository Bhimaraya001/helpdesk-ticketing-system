
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

function Signup({ onAuthenticated }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");

    if (password.length < 8 || password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Account creation failed.");
      }

      onAuthenticated(data.user);
      navigate("/customer", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure it is running on port 5000."
          : err.message || "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          Help<span>Desk</span>
        </Link>

        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Join HelpDesk to manage support requests.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            maxLength={120}
            required
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={255}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
          />

          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
