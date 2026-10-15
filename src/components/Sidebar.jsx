
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role = "CUSTOMER" }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const isCustomer = role === "CUSTOMER";

  const links = isCustomer
    ? [
        { label: "Dashboard", path: "/customer" },
        { label: "My Tickets", path: "/customer/tickets" },
        { label: "Create Ticket", path: "/customer/create-ticket" },
      ]
    : [
        { label: "Dashboard", path: "/admin" },
        { label: "All Tickets", path: "/admin/tickets" },
        { label: "Reports", path: "/admin/reports" },
        { label: "Settings", path: "/admin/settings" },
      ];

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Could not log out. Please try again.");
      }

      // Reloading clears the previous React authentication state.
      window.location.replace("/login");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Please check that it is running."
          : err.message
      );
      setLoggingOut(false);
    }
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        Help<span>Desk</span>
      </div>

      <div className="nav-label">Workspace</div>

      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          {link.label}
        </NavLink>
      ))}

      <div className="nav-label">Account</div>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <button
        type="button"
        className="nav-item"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </aside>
  );
}

export default Sidebar;
