
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import Reports from "./pages/Reports";
import TicketDetails from "./pages/TicketDetails";


import "./styles.css";

const STORAGE_KEY = "helpdesk-tickets";
const API_URL = "http://helpdesk-backend-env-env.eba-edyh573c.ap-southeast-2.elasticbeanstalk.com";

function RequireAuth({ user, loading, roles, children }) {
  const location = useLocation();

  if (loading) {
    return <p className="auth-subtitle">Checking your session...</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin" : "/customer"}
        replace
      />
    );
  }

  return children;
}

function HomeRedirect({ user, loading }) {
  if (loading) {
    return <p className="auth-subtitle">Checking your session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user.role === "ADMIN" ? "/admin" : "/customer"}
      replace
    />
  );
}

function AppRoutes({
  user,
  setUser,
  authLoading,
  tickets,
  setTickets,
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomeRedirect user={user} loading={authLoading} />}
      />

      
<Route
  path="/login"
  element={<Login onAuthenticated={setUser} />}
/>

      <Route
        path="/signup"
        element={
          user ? (
            <Navigate
              to={user.role === "ADMIN" ? "/admin" : "/customer"}
              replace
            />
          ) : (
            <Signup onAuthenticated={setUser} />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAuth
            user={user}
            loading={authLoading}
            roles={["ADMIN"]}
          >
            <Dashboard tickets={tickets} setTickets={setTickets} />
          </RequireAuth>
        }
      />
      

      <Route
        path="/admin/tickets"
        element={
          <RequireAuth
            user={user}
            loading={authLoading}
            roles={["ADMIN"]}
          >
            <AllTickets />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <RequireAuth
            user={user}
            loading={authLoading}
            roles={["ADMIN"]}
          >
            <Reports />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <RequireAuth
            user={user}
            loading={authLoading}
            roles={["ADMIN"]}
          >
            <PlaceholderPage title="Settings" />
          </RequireAuth>
        }
      />

      <Route
        path="/customer"
        element={
          <RequireAuth
            user={user}
            loading={authLoading}
            roles={["CUSTOMER"]}
          >
            <CustomerDashboard tickets={tickets} />
          </RequireAuth>
        }
      />

      <Route
        path="/customer/tickets"
        element={
          <RequireAuth
            user={user}
            loading={authLoading}
            roles={["CUSTOMER"]}
          >
            <MyTickets tickets={tickets} />
          </RequireAuth>
        }
      />

      <Route
        path="/customer/create-ticket"
        element={
          <RequireAuth
            user={user}
            loading={authLoading}
            roles={["CUSTOMER"]}
          >
            <CreateTicket
              tickets={tickets}
              setTickets={setTickets}
            />
          </RequireAuth>
        }
      />
       
<Route
  path="/ticket/:id"
  element={
    <RequireAuth
      user={user}
      loading={authLoading}
      roles={["ADMIN", "CUSTOMER"]}
    >
      <TicketDetails />
    </RequireAuth>
  }
/>


      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (active) setUser(null);
          return;
        }

        const data = await response.json();

        if (active) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Could not check login session:", error);
        if (active) setUser(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error("Could not save tickets:", error);
    }
  }, [tickets]);

  return (
    <BrowserRouter>
      <AppRoutes
        user={user}
        setUser={setUser}
        authLoading={authLoading}
        tickets={tickets}
        setTickets={setTickets}
      />
    </BrowserRouter>
  );
}

export default App;
