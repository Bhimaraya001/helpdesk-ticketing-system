
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../api";

const TICKETS_API = `${API_URL}/api/tickets`;

function formatDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString();
}

function getStatusClass(status) {
  switch (status) {
    case "Open":
      return "status-open";
    case "In Progress":
      return "status-in-progress";
    case "Resolved":
      return "status-resolved";
    default:
      return "";
  }
}

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTicketDetails() {
      setLoading(true);
      setError("");

      try {
        const [ticketResponse, historyResponse] = await Promise.all([
          fetch(`${TICKETS_API}/${id}`, {
            credentials: "include",
          }),
          fetch(`${TICKETS_API}/${id}/history`, {
            credentials: "include",
          }),
        ]);

        if (
          ticketResponse.status === 401 ||
          historyResponse.status === 401
        ) {
          navigate("/login", { replace: true });
          return;
        }

        if (
          ticketResponse.status === 403 ||
          historyResponse.status === 403
        ) {
          throw new Error(
            "You are not allowed to view this ticket."
          );
        }

        if (
          ticketResponse.status === 404 ||
          historyResponse.status === 404
        ) {
          throw new Error("Ticket not found.");
        }

        if (!ticketResponse.ok) {
          throw new Error("Could not load ticket details.");
        }

        if (!historyResponse.ok) {
          throw new Error("Could not load ticket history.");
        }

        const ticketData = await ticketResponse.json();
        const historyData = await historyResponse.json();

        if (!Array.isArray(historyData)) {
          throw new Error("Invalid ticket history response.");
        }

        if (!cancelled) {
          setTicket(ticketData);
          setHistory(historyData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Something went wrong while loading the ticket."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTicketDetails();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  function getBackPath() {
    return -1;
  }

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading ticket details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <h2>Unable to open ticket</h2>
        <p role="alert">{error}</p>
        <button onClick={() => navigate(getBackPath())}>
          Go back
        </button>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="page-container">
        <p>Ticket not found.</p>
      </main>
    );
  }

  const ticketLabel = ticket.displayId || `HD-${ticket.id}`;
  const description =
    ticket.description || "No description was provided.";
  const createdAt = ticket.created_at || ticket.createdAt;

  return (
    <main className="page-container ticket-details-page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(getBackPath())}
      >
        ← Back to tickets
      </button>

      <section className="ticket-details-card">
        <div className="ticket-details-heading">
          <div>
            <p className="muted">{ticketLabel}</p>
            <h1>{ticket.subject || "Untitled ticket"}</h1>
          </div>

          <span
            className={`badge ${getStatusClass(ticket.status)}`}
          >
            {ticket.status || "Open"}
          </span>
        </div>

        <div className="ticket-details-grid">
          <div>
            <strong>Customer</strong>
            <p>{ticket.customer || ticket.name || "—"}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{ticket.email || "—"}</p>
          </div>

          <div>
            <strong>Priority</strong>
            <p>{ticket.priority || "Medium"}</p>
          </div>

          <div>
            <strong>Category</strong>
            <p>{ticket.category || "—"}</p>
          </div>

          <div>
            <strong>Created</strong>
            <p>{formatDate(createdAt)}</p>
          </div>
        </div>

        <hr />

        <h2>Description</h2>
        <p className="ticket-description">{description}</p>
      </section>

      <section className="ticket-details-card">
        <h2>Ticket activity history</h2>
        <p className="muted">
          A record of status changes for this ticket.
        </p>

        {history.length === 0 ? (
          <p>No status history has been recorded yet.</p>
        ) : (
          <ol className="ticket-timeline">
            {history.map((event) => (
              <li key={event.id} className="ticket-timeline-item">
                <div className="timeline-marker" />

                <div className="timeline-content">
                  <h3>
                    {event.old_status
                      ? `${event.old_status} → ${event.new_status}`
                      : `Ticket created — ${event.new_status}`}
                  </h3>

                  <p className="muted">
                    {formatDate(event.created_at)}
                  </p>

                  <p>
                    Changed by:{" "}
                    {event.changed_by != null
                      ? `User ID ${event.changed_by}`
                      : "System or unavailable user"}
                  </p>

                  {event.comment && <p>{event.comment}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

export default TicketDetails;
