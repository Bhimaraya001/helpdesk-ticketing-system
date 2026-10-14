
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles.css";

const API_URL = "http://localhost:5000/api/tickets";

function Reports() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not load report data.");
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message || "Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  const statuses = ["Open", "In Progress", "Resolved"];
  const priorities = ["Urgent", "High", "Medium", "Low"];

  function countBy(field, value) {
    return tickets.filter((ticket) => ticket[field] === value).length;
  }

  const today = new Date().toISOString().slice(0, 10);

  const createdToday = tickets.filter((ticket) => {
    if (!ticket.created_at) return false;

    return new Date(ticket.created_at).toISOString().slice(0, 10) === today;
  }).length;

  return (
    <div className="app-layout">
      <Sidebar role="ADMIN" />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Reports & Analytics</h1>
            <p className="muted">
              Support ticket statistics from your PostgreSQL database.
            </p>
          </div>
          <div className="user-avatar">SA</div>
        </header>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="muted">Loading report data...</p>
        ) : (
          <>
            <section className="stats-grid">
              <article className="stat-card">
                <div className="stat-title">Total Tickets</div>
                <div className="stat-value">{tickets.length}</div>
                <div className="stat-description">All recorded tickets</div>
              </article>

              <article className="stat-card">
                <div className="stat-title">Open Tickets</div>
                <div className="stat-value">{countBy("status", "Open")}</div>
                <div className="stat-description">Awaiting resolution</div>
              </article>

              <article className="stat-card">
                <div className="stat-title">In Progress</div>
                <div className="stat-value">
                  {countBy("status", "In Progress")}
                </div>
                <div className="stat-description">Currently being handled</div>
              </article>

              <article className="stat-card">
                <div className="stat-title">Resolved</div>
                <div className="stat-value">
                  {countBy("status", "Resolved")}
                </div>
                <div className="stat-description">Successfully completed</div>
              </article>
            </section>

            <section className="section-card">
              <h2>Tickets by Status</h2>

              {statuses.map((status) => {
                const count = countBy("status", status);
                const percentage = tickets.length
                  ? Math.round((count / tickets.length) * 100)
                  : 0;

                return (
                  <div key={status} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span>{status}</span>
                      <strong>
                        {count} ({percentage}%)
                      </strong>
                    </div>

                    <div
                      style={{
                        height: "10px",
                        background: "#e5e7eb",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "#64748b",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="section-card">
              <h2>Tickets by Priority</h2>

              <div className="stats-grid">
                {priorities.map((priority) => (
                  <article className="stat-card" key={priority}>
                    <div className="stat-title">{priority} Priority</div>
                    <div className="stat-value">
                      {countBy("priority", priority)}
                    </div>
                    <div className="stat-description">
                      Tickets marked {priority.toLowerCase()}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="section-card">
              <h2>Activity Summary</h2>
              <p>
                <strong>Tickets created today:</strong> {createdToday}
              </p>
              <p>
                <strong>Resolution rate:</strong>{" "}
                {tickets.length
                  ? Math.round(
                      (countBy("status", "Resolved") / tickets.length) * 100
                    )
                  : 0}
                %
              </p>

              <Link className="customer-create-button" to="/admin/tickets">
                View All Tickets
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Reports;
