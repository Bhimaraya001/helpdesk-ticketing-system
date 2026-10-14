
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles.css";

function PlaceholderPage({ title, role = "ADMIN" }) {
  const home = role === "CUSTOMER" ? "/customer" : "/admin";

  return (
    <div className="app-layout">
      <Sidebar role={role} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p className="muted">
              This section will be implemented next.
            </p>
          </div>
        </header>

        <section className="section-card">
          <h2>{title}</h2>
          <p className="muted">
            The page is connected. Its functionality is coming soon.
          </p>
          <Link to={home}>← Back to Dashboard</Link>
        </section>
      </main>
    </div>
  );
}

export default PlaceholderPage;
