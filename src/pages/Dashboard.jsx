
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API_URL from "../api";
import "../styles.css";

const TICKETS_API = `${API_URL}/api/tickets`;

function Dashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTickets() {
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
            "Admin access required. Log in using an account with the ADMIN role."
          );
        }

        if (!response.ok) {
          throw new Error("Could not load tickets from the backend.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The server returned an unexpected ticket list.");
        }

        const formattedTickets = data.map((ticket) => {
          const imageUrls = Array.isArray(ticket.image_urls)
            ? ticket.image_urls
            : [];

          return {
            ...ticket,
            id: ticket.id,
            displayId: `HD-${ticket.id}`,
            createdAt: ticket.created_at
              ? new Date(ticket.created_at).toLocaleDateString()
              : "",
            photos: imageUrls.map((url, index) => ({
              name: `Attachment ${index + 1}`,
              url,
            })),
          };
        });

        if (!cancelled) {
          setTickets(formattedTickets);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message === "Failed to fetch"
              ? "Cannot connect to the deployed backend. Please try again later."
              : err.message || "Unable to load tickets."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTickets();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function updateStatus(ticketId, newStatus) {
    setUpdatingId(ticketId);
    setError("");

    try {
      const response = await fetch(
        `${TICKETS_API}/${ticketId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (response.status === 403
              ? "Admin access is required to update ticket status."
              : "Could not update ticket status.")
        );
      }

      setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
          String(ticket.id) === String(ticketId)
            ? { ...ticket, status: result.status }
            : ticket
        )
      );
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend."
          : err.message || "Unable to update ticket status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch = [
      ticket.subject,
      ticket.customer,
      ticket.email,
      ticket.displayId,
      ticket.id,
    ].some((value) =>
      String(value || "").toLowerCase().includes(search)
    );

    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = [
    {
      title: "Total Tickets",
      value: tickets.length,
      description: "All tickets created",
    },
    {
      title: "Open Tickets",
      value: tickets.filter((ticket) => ticket.status === "Open").length,
      description: "Awaiting resolution",
    },
    {
      title: "In Progress",
      value: tickets.filter(
        (ticket) => ticket.status === "In Progress"
      ).length,
      description: "Currently being handled",
    },
    {
      title: "Resolved",
      value: tickets.filter(
        (ticket) => ticket.status === "Resolved"
      ).length,
      description: "Successfully completed",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar role="ADMIN" />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="muted">
              View customer requests, inspect attachments, and update ticket status.
            </p>
          </div>

          <div className="user-avatar">AD</div>
        </header>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {loading && <p className="muted">Loading dashboard...</p>}

        {!loading && !error && (
          <section className="stats-grid">
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
          <h2>All Support Tickets</h2>
          <p className="muted">
            Status changes are saved to the database.
          </p>

          <div className="ticket-filters">
            <input
              type="search"
              placeholder="Search ID, subject, customer, or email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="All">All priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            <button
              type="button"
              className="reset-filters"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
            >
              Reset
            </button>
          </div>

          <p className="muted results-count">
            {loading
              ? "Loading tickets..."
              : `Showing ${filteredTickets.length} of ${tickets.length} tickets`}
          </p>

          {!loading && (
            <div className="table-wrapper">
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Customer</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <strong>{ticket.subject}</strong>
                        <div className="muted">{ticket.displayId}</div>
                        <div className="muted">
                          {ticket.category || "General"}
                        </div>
                        <p>{ticket.description}</p>

                        {ticket.photos.length > 0 && (
                          <div className="photo-preview-grid">
                            {ticket.photos.map((photo, index) => (
                              <div
                                className="photo-preview"
                                key={`${ticket.id}-${index}`}
                              >
                                <a
                                  href={photo.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={photo.url}
                                    alt={`Attachment ${index + 1} for ${ticket.displayId}`}
                                  />
                                </a>

                                <div className="photo-preview-footer">
                                  <span>{photo.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      <td>
                        {ticket.customer || "Customer"}
                        <div className="muted">{ticket.email}</div>
                      </td>

                      <td>{ticket.priority}</td>

                      <td>
                        <select
                          aria-label={`Update status for ${ticket.displayId}`}
                          value={ticket.status}
                          disabled={updatingId === ticket.id}
                          onChange={(event) =>
                            updateStatus(ticket.id, event.target.value)
                          }
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        {updatingId === ticket.id && (
                          <small> Saving...</small>
                        )}
                      </td>

                      <td>{ticket.createdAt || "—"}</td>
                    </tr>
                  ))}

                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan="5">
                        {tickets.length === 0
                          ? "No tickets have been created yet."
                          : "No tickets match your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="section-card">
          <h2>Customer Preview</h2>
          <p className="muted">
            Open the customer-facing pages to review their layout.
          </p>
          <div className="customer-action">
            <Link to="/customer">Customer Dashboard →</Link>
            {" | "}
            <Link to="/customer/tickets">Customer Tickets →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
