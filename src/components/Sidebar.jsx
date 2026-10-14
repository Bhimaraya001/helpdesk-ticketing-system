
import { NavLink } from "react-router-dom";

function Sidebar({ role = "ADMIN" }) {
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
    </aside>
  );
}

export default Sidebar;
