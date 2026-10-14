
import { Link } from "react-router-dom";
import "../styles.css";

function Signup() {
  function handleSubmit(event) {
    event.preventDefault();
    alert("Signup UI is ready. Backend registration will be added next.");
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
            type="text"
            placeholder="Enter your name"
            required
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />

          <label htmlFor="signup-role">Account type</label>
          <select id="signup-role" defaultValue="CUSTOMER" required>
            <option value="CUSTOMER">Customer</option>
            <option value="SUPPORT_AGENT">Support Agent (demo only)</option>
          </select>

          <button type="submit" className="auth-button">
            Create account
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
