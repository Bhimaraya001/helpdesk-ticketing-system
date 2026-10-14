
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import initialTickets from "./data/initialTickets";
import "./styles.css";

function App() {
  const [tickets, setTickets] = useState(initialTickets);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={<Dashboard tickets={tickets} />}
        />
        <Route
          path="/admin/tickets"
          element={<Dashboard tickets={tickets} />}
        />
        <Route
          path="/admin/reports"
          element={<PlaceholderPage title="Reports" />}
        />
        <Route
          path="/admin/settings"
          element={<PlaceholderPage title="Settings" />}
        />

        <Route
          path="/customer"
          element={<CustomerDashboard tickets={tickets} />}
        />
        <Route
          path="/customer/tickets"
          element={<MyTickets tickets={tickets} />}
        />
        <Route
          path="/customer/create-ticket"
          element={
            <CreateTicket
              tickets={tickets}
              setTickets={setTickets}
            />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/admin" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
