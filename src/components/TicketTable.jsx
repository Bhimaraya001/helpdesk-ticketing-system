import { Link } from "react-router-dom";
function TicketTable({ tickets, onStatusChange, updatingId }) {
  return (
    <div className="table-wrapper">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Subject / Customer</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="5" className="table-empty">
                No tickets found.
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
  <Link to={`/ticket/${ticket.id}`}>
    {ticket.displayId || `HD-${ticket.id}`}
  </Link>
</td>

                <td>
                  <div className="ticket-subject">
                    {ticket.subject}
                  </div>
                  <div className="ticket-customer">
                    {ticket.customer}
                  </div>
                  <div className="muted">{ticket.email}</div>
                </td>

                <td>
                  <span
                    className={`badge priority-${String(
                      ticket.priority || "Medium"
                    )
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {ticket.priority || "Medium"}
                  </span>
                </td>

                <td>
                  {onStatusChange ? (
                    <select
                      aria-label={`Update status for ${ticket.displayId || ticket.id}`}
                      value={ticket.status}
                      disabled={String(updatingId) === String(ticket.id)}
                      onChange={(event) =>
                        onStatusChange(ticket.id, event.target.value)
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <span
                      className={`badge status-${String(
                        ticket.status || "Open"
                      )
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {ticket.status || "Open"}
                    </span>
                  )}
                </td>

                <td>{ticket.createdAt || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default TicketTable;
