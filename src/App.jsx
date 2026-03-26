import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import AdminNavbar from "./components/AdminNavbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import AddBus from "./pages/AddBus";
import About from "./pages/About";
import AdminUsers from "./pages/AdminUsers";
import AdminBuses from "./pages/AdminBuses";
import AdminBookings from "./pages/AdminBookings";

const Layout = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Hide user navbar on login/register/admin pages
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    isAdminRoute; 

  return (
    <>
      {/* Show User Navbar only on non-hidden, non-admin routes */}
      {!hideNavbar && <Navbar />}

      {/* Show Admin Navbar only for admin routes */}
      {isAdminRoute && <AdminNavbar />}

      <div className={!hideNavbar ? "pt-0" : ""}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/select-seats" element={<SeatSelection />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/bookings" element={<Bookings />} />

          {/* Admin Routes — all protected */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-bus"
            element={
              <AdminRoute>
                <AddBus />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/buses"
            element={
              <AdminRoute>
                <AdminBuses />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;