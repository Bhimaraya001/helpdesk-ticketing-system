import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles.css";

const API_URL = "http://localhost:5000/api/tickets/mine";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchMyTickets() {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            response.status === 403
              ? "Your account does not have customer access."
              : "Could not load your tickets. Please try again."
          );
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
              ? "Cannot connect to the backend. Make sure it is running on port 5000."
              : err.message || "Unable to load your tickets."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMyTickets();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const stats = [
    {
      title: "My Tickets",
      value: tickets.length,
      description: "All your support requests",
    },
    {
      title: "Open",
      value: openCount,
      description: "Waiting for support",
    },
    {
      title: "Resolved",
      value: resolvedCount,
      description: "Completed requests",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar role="CUSTOMER" />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>My Dashboard</h1>
            <p className="muted">
              Manage your customer support requests.
            </p>
          </div>

          <div className="user-avatar">CU</div>
        </header>

        {loading && (
          <p className="muted">Loading your ticket statistics...</p>
        )}

        {error && <p className="form-error">{error}</p>}

        {!loading && !error && (
          <section className="stats-grid customer-stats">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.title}>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-description">
                  {stat.description}
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="section-card">
          <h2>Welcome to HelpDesk</h2>
          <p className="muted">
            Submit a support request or track an existing one.
          </p>

          <Link
            className="customer-create-button"
            to="/customer/create-ticket"
          >
            + Create New Ticket
          </Link>

          <div className="customer-action">
            <Link to="/customer/tickets">
              View My Tickets →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;