
import "./styles.css";

const stats = [
  {
    title: "Total Tickets",
    value: "128",
    description: "All tickets created",
  },
  {
    title: "Open Tickets",
    value: "42",
    description: "Awaiting resolution",
  },
  {
    title: "In Progress",
    value: "31",
    description: "Currently being handled",
  },
  {
    title: "Resolved",
    value: "55",
    description: "Successfully completed",
  },
];

function App() {
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
            Your latest customer support requests will appear here.
          </p>

          <div className="empty-state">
            No tickets displayed yet. We will add the ticket table next.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
