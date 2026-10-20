
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TicketTable from "../components/TicketTable";
import API_URL from "../api";
import "../styles.css";

const TICKETS_API = `${API_URL}/api/tickets/mine`;

function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        const formattedTickets = data.map((ticket) => {
          const imageUrls = Array.isArray(ticket.image_urls)
            ? ticket.image_urls
            : [];

          return {
            ...ticket,
            id: ticket.id,
            displayId: `HD-${ticket.id}`,
            createdAt: ticket.created_at
              ? String(ticket.created_at).slice(0, 10)
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
              : err.message || "Unable to load your tickets."
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

  return (
    <div className="app-layout">
      <Sidebar role="CUSTOMER" />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>My Tickets</h1>
            <p className="muted">
              Track the progress of your support requests.
            </p>
          </div>

          <div className="user-avatar">CU</div>
        </header>

        <section className="section-card">
          <div className="ticket-list-heading">
            <h2>Your Support Requests</h2>

            <Link
              className="customer-create-button"
              to="/customer/create-ticket"
            >
              + Create Ticket
            </Link>
          </div>

          {loading && <p className="muted">Loading your tickets...</p>}

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <p className="muted">
                You have {tickets.length} ticket(s).
              </p>

              {tickets.length === 0 ? (
                <p className="muted">
                  You have not created any tickets yet. Use Create Ticket
                  to submit your first support request.
                </p>
              ) : (
                <>
                  <TicketTable tickets={tickets} />

                  <div className="ticket-descriptions">
                    {tickets.map((ticket) => (
                      <article
                        className="ticket-description"
                        key={ticket.id}
                      >
                        <h3>
                          <Link to={`/ticket/${ticket.id}`}>
                            {ticket.displayId || `HD-${ticket.id}`}
                          </Link>
                          : {ticket.subject}
                        </h3>

                        <p>{ticket.description}</p>

                        <p className="muted">
                          Category: {ticket.category}
                        </p>

                        <p className="muted">
                          Priority: {ticket.priority}
                        </p>

                        <p className="muted">
                          Status: {ticket.status}
                        </p>

                        {ticket.photos.length > 0 && (
                          <div className="photo-preview-grid">
                            {ticket.photos.map((photo, index) => (
                              <div
                                className="photo-preview"
                                key={`${ticket.id}-${index}`}
                              >
                                <img
                                  src={photo.url}
                                  alt={`Attachment ${index + 1} for ${ticket.displayId}`}
                                />

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
                </>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyTickets;
