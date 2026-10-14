
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TicketTable from "../components/TicketTable";
import "../styles.css";

function MyTickets({ tickets }) {
  // Demo identity until real login is connected.
  const customerEmail = "customer@example.com";

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
                    {ticket.id}: {ticket.subject}
                  </h3>

                  <p>{ticket.description}</p>

                  <p className="muted">
                    Category: {ticket.category}
                  </p>

                  {/* Display attached photos */}
                  {ticket.photos?.length > 0 && (
                    <div className="photo-preview-grid">
                      {ticket.photos.map((photo, index) => (
                        <div
                          className="photo-preview"
                          key={`${photo.name}-${index}`}
                        >
                          <img
                            src={photo.url}
                            alt={`Attachment ${index + 1} for ${ticket.id}`}
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
        </section>
      </main>
    </div>
  );
}

export default MyTickets;
