import { useEffect, useState } from "react";
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
import AllTickets from "./pages/AllTickets";
import "./styles.css";

const STORAGE_KEY = "helpdesk-tickets";

function App() {
  const [tickets, setTickets] = useState(() => {
    try {
      const savedTickets = localStorage.getItem(STORAGE_KEY);
      return savedTickets ? JSON.parse(savedTickets) : initialTickets;
    } catch (error) {
      console.error("Could not load saved tickets:", error);
      return initialTickets;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error("Could not save tickets:", error);
      alert("Storage is full. Try removing some large image attachments.");
    }
  }, [tickets]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={<Dashboard tickets={tickets} setTickets={setTickets} />}
        />
        <Route
  path="/admin/tickets"
  element={<AllTickets />}
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
            <CreateTicket tickets={tickets} setTickets={setTickets} />
          }
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;