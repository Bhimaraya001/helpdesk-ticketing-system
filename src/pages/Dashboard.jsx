
import { useState } from "react";
import "../styles.css";
import TicketTable from "../components/TicketTable";

function Dashboard() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Filter tickets based on search, status, and priority
  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      ticket.subject.toLowerCase().includes(search) ||
      ticket.customer.toLowerCase().includes(search) ||
      ticket.email.toLowerCase().includes(search);

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
      value: tickets.filter((t) => t.status === "Open").length,
      description: "Awaiting resolution",
    },
    {
      title: "In Progress",
      value: tickets.filter((t) => t.status === "In Progress").length,
      description: "Currently being handled",
    },
    {
      title: "Resolved",
      value: tickets.filter((t) => t.status === "Resolved").length,
      description: "Successfully completed",
    },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          Help<span>Desk</span>
        </div>

        <div className="nav-label">Workspace</div>
        <button className="nav-item active">Dashboard</button>
        <button className="nav-item">All Tickets</button>
        <button className="nav-item">My Tickets</button>

        <div className="nav-label">Management</div>
        <button className="nav-item">Reports</button>
        <button className="nav-item">Settings</button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <div className="muted">
              Welcome back! Here is your support overview.
            </div>
          </div>

          <div className="user-avatar" title="Support Agent">
            SA
          </div>
        </header>

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

        <section className="section-card">
          <h2>Recent Tickets</h2>
          <p className="muted">
            Search and filter customer support requests.
          </p>

          <div className="ticket-filters">
            <input
              type="search"
              placeholder="Search subject, customer, or email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search tickets"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              aria-label="Filter by priority"
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

          <TicketTable tickets={filteredTickets} />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
