
function TicketTable({ tickets }) {
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
                  <strong>{ticket.id}</strong>
                </td>

                <td>
                  <div className="ticket-subject">
                    {ticket.subject}
                  </div>
                  <div className="ticket-customer">
                    {ticket.customer}
                  </div>
                </td>

                <td>
                  <span
                    className={`badge priority-${ticket.priority
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge status-${ticket.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td>{ticket.createdAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;
