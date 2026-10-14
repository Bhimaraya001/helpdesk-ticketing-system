
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TicketTable from "../components/TicketTable";
import "../styles.css";

const API_URL = "http://localhost:5000/api/tickets";

function MyTickets() {
  const customerEmail = "customer@example.com";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not load tickets from the backend.");
        }

        const data = await response.json();

        const formattedTickets = data.map((ticket) => {
          const imageUrls = Array.isArray(ticket.image_urls)
            ? ticket.image_urls
            : [];

          return {
            ...ticket,
            id: ticket.id,
            displayId: `HD-${ticket.id}`,
            createdAt: ticket.created_at
              ? ticket.created_at.slice(0, 10)
              : "",
            photos: imageUrls.map((url, index) => ({
              name: `Attachment ${index + 1}`,
              url,
            })),
          };
        });

        setTickets(formattedTickets);
        setError("");
      } catch (err) {
        setError(
          err.message ||
            "Unable to connect to the backend. Make sure it is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const myTickets = tickets.filter(
    (ticket) => ticket.email === customerEmail
  );

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

          {error && <p className="form-error">{error}</p>}

          {!loading && !error && (
            <>
              <p className="muted">
                You have {myTickets.length} ticket(s).
              </p>

              <TicketTable tickets={myTickets} />

              {myTickets.length > 0 && (
                <div className="ticket-descriptions">
                  {myTickets.map((ticket) => (
                    <article
                      className="ticket-description"
                      key={ticket.id}
                    >
                      <h3>
                        {ticket.displayId}: {ticket.subject}
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

                      {ticket.photos?.length > 0 && (
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
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyTickets;
