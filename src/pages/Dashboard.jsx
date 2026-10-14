import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

function Dashboard({ tickets, setTickets }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  function updateStatus(ticketId, newStatus) {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
  }

  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch = [
      ticket.subject,
      ticket.customer,
      ticket.email,
      ticket.id,
    ].some((value) => String(value || "").toLowerCase().includes(search));

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
      value: tickets.filter((ticket) => ticket.status === "In Progress").length,
      description: "Currently being handled",
    },
    {
      title: "Resolved",
      value: tickets.filter((ticket) => ticket.status === "Resolved").length,
      description: "Successfully completed",
    },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">Help<span>Desk</span></div>
        <div className="nav-label">Workspace</div>
        <Link className="nav-item active" to="/admin">Dashboard</Link>
        <Link className="nav-item" to="/admin/tickets">All Tickets</Link>
        <div className="nav-label">Management</div>
        <Link className="nav-item" to="/admin/reports">Reports</Link>
        <Link className="nav-item" to="/admin/settings">Settings</Link>
        <div className="nav-label">Customer Preview</div>
        <Link className="nav-item" to="/customer">Customer Dashboard</Link>
        <Link className="nav-item" to="/customer/tickets">Customer Tickets</Link>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="muted">
              View customer requests, inspect attachments, and update ticket status.
            </p>
          </div>
          <div className="user-avatar">SA</div>
        </header>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.title}>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-description">{stat.description}</div>
            </article>
          ))}
        </section>

        <section className="section-card">
          <h2>All Support Tickets</h2>
          <p className="muted">
            Updates made here are also visible on the customer ticket page.
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
            Showing {filteredTickets.length} of {tickets.length} tickets
          </p>

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
                      <div className="muted">{ticket.id}</div>
                      <div className="muted">
                        {ticket.category || "General"}
                      </div>
                      <p>{ticket.description}</p>

                      {ticket.photos?.length > 0 && (
                        <div className="photo-preview-grid">
                          {ticket.photos.map((photo, index) => (
                            <div
                              className="photo-preview"
                              key={`${photo.name}-${index}`}
                            >
                              <a
                                href={photo.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={photo.url}
                                  alt={`Attachment ${index + 1} for ${ticket.id}`}
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
                        aria-label={`Update status for ${ticket.id}`}
                        value={ticket.status}
                        onChange={(event) =>
                          updateStatus(ticket.id, event.target.value)
                        }
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td>{ticket.createdAt || "—"}</td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="5">No tickets match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;