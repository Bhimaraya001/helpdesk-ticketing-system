
import { Link } from "react-router-dom";
import "../styles.css";

function Login() {
  function handleSubmit(event) {
    event.preventDefault();
    alert("Login UI is ready. Backend authentication will be added next.");
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
            type="email"
            placeholder="you@example.com"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            required
            minLength={8}
          />

          <button type="submit" className="auth-button">
            Sign in
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
