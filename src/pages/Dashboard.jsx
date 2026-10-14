
import { useState } from "react";
import "../styles.css";
import initialTickets from "../data/initialTickets";
import TicketTable from "../components/TicketTable";


function App() {
  const [tickets] = useState(initialTickets);

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
      value: tickets.filter((ticket) => ticket.status === "Resolved").length,
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
            View the latest customer support requests.
          </p>

          <TicketTable tickets={tickets} />
        </section>
      </main>
    </div>
  );
}

export default App;
