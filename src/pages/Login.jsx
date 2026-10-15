
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

function Login({ onAuthenticated }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      onAuthenticated(data.user);

      if (data.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/customer", { replace: true });
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure it is running on port 5000."
          : err.message || "Unable to log in. Please try again."
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

        <h1>Welcome back</h1>
        <p className="auth-subtitle">
          Sign in to manage your support tickets.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            minLength={8}
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
