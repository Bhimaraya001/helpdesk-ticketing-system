import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TicketTable from "../components/TicketTable";
import "../styles.css";

const API_URL = "http://localhost:5000/api/tickets";

function AllTickets() {
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

    async function loadTickets() {
      try {
        const response = await fetch(API_URL, {
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
              ? "Cannot connect to the backend. Make sure it is running on port 5000."
              : err.message || "Unable to connect to the backend."
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

  async function updateStatus(ticketId, newStatus) {
    setUpdatingId(ticketId);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${ticketId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const result = await response.json();

      if (response.status === 403) {
        throw new Error("Admin access is required to update ticket status.");
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Could not update ticket status."
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
      ticket.displayId,
      ticket.id,
      ticket.subject,
      ticket.customer,
      ticket.email,
    ].some((value) =>
      String(value || "").toLowerCase().includes(search)
    );

    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="app-layout">
      <Sidebar role="ADMIN" />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>All Tickets</h1>
            <p className="muted">
              View and manage support tickets stored in the database.
            </p>
          </div>
          <div className="user-avatar">SA</div>
        </header>

        <section className="section-card">
          <div className="ticket-list-heading">
            <h2>Ticket Management</h2>
            <Link className="customer-create-button" to="/admin">
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

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

          {!loading && !error && (
            <>
              <TicketTable
                tickets={filteredTickets}
                onStatusChange={updateStatus}
                updatingId={updatingId}
              />

              {filteredTickets.length > 0 && (
                <div className="ticket-descriptions">
                  {filteredTickets.map((ticket) => (
                    <article className="ticket-description" key={ticket.id}>
                      <h3>
                        {ticket.displayId}: {ticket.subject}
                      </h3>

                      <p>{ticket.description}</p>
                      <p className="muted">
                        Category: {ticket.category}
                      </p>
                      <p className="muted">
                        Email: {ticket.email}
                      </p>

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
                                  alt={`${photo.name} for ${ticket.displayId}`}
                                />
                              </a>
                              <div className="photo-preview-footer">
                                <span>{photo.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AllTickets;