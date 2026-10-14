
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles.css";

function CustomerDashboard({ tickets }) {
  const customerEmail = "customer@example.com";

  const myTickets = tickets.filter(
    (ticket) => ticket.email === customerEmail
  );

  const openCount = myTickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const resolvedCount = myTickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const stats = [
    {
      title: "My Tickets",
      value: myTickets.length,
      description: "All your support requests",
    },
    {
      title: "Open",
      value: openCount,
      description: "Waiting for support",
    },
    {
      title: "Resolved",
      value: resolvedCount,
      description: "Completed requests",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar role="CUSTOMER" />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>My Dashboard</h1>
            <p className="muted">
              Manage your customer support requests.
            </p>
          </div>
          <div className="user-avatar">CU</div>
        </header>

        <section className="stats-grid customer-stats">
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
          <h2>Welcome to HelpDesk</h2>
          <p className="muted">
            Submit a support request or track an existing one.
          </p>

          <Link
            className="customer-create-button"
            to="/customer/create-ticket"
          >
            + Create New Ticket
          </Link>

          <div className="customer-action">
            <Link to="/customer/tickets">
              View My Tickets →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;
