
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API_URL from "../api";
import "../styles.css";

const TICKETS_API = `${API_URL}/api/tickets`;

function Reports() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      try {
        const response = await fetch(TICKETS_API, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        if (response.status === 403) {
          throw new Error(
            "Admin access required. Log in with an account whose database role is ADMIN."
          );
        }

        if (!response.ok) {
          throw new Error("Could not load report data.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The server returned an unexpected ticket list.");
        }

        if (!cancelled) {
          setTickets(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message === "Failed to fetch"
              ? "Cannot connect to the deployed backend. Please try again later."
              : err.message || "Unable to load report data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const statuses = ["Open", "In Progress", "Resolved"];
  const priorities = ["Urgent", "High", "Medium", "Low"];

  function countBy(field, value) {
    return tickets.filter((ticket) => ticket[field] === value).length;
  }

  // Use local calendar dates to determine tickets created today.
  const now = new Date();
  const today = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const createdToday = tickets.filter((ticket) => {
    if (!ticket.created_at) return false;

    const created = new Date(ticket.created_at);

    if (Number.isNaN(created.getTime())) return false;

    const createdDate = `${created.getFullYear()}-${String(
      created.getMonth() + 1
    ).padStart(2, "0")}-${String(created.getDate()).padStart(2, "0")}`;

    return createdDate === today;
  }).length;

  const resolvedCount = countBy("status", "Resolved");

  const resolutionRate = tickets.length
    ? Math.round((resolvedCount / tickets.length) * 100)
    : 0;

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
        ) : error ? (
          <section className="section-card">
            <h2>Reports unavailable</h2>
            <p className="muted">
              Statistics could not be calculated because ticket data could
              not be loaded.
            </p>
            <Link className="customer-create-button" to="/admin">
              Back to Dashboard
            </Link>
          </section>
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
                <div className="stat-description">
                  Currently being handled
                </div>
              </article>

              <article className="stat-card">
                <div className="stat-title">Resolved</div>
                <div className="stat-value">{resolvedCount}</div>
                <div className="stat-description">
                  Successfully completed
                </div>
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
                <strong>Resolution rate:</strong> {resolutionRate}%
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
