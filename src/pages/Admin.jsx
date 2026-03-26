import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .admin-root {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .admin-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(220,38,38,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(37,99,235,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .admin-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
    z-index: 0;
  }

  .admin-content {
    position: relative;
    z-index: 1;
    padding: 7rem 3rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .admin-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .admin-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 0.6rem;
  }

  .admin-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0;
  }

  .admin-title span {
    background: linear-gradient(135deg, #f87171 0%, #fb923c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .admin-divider {
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, #dc2626, #3b82f6);
    margin: 1.2rem auto 0;
    border-radius: 2px;
  }

  .admin-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .admin-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .stat-card {
    position: relative;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    text-align: center;
    backdrop-filter: blur(12px);
    overflow: hidden;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
  }

  .stat-card:hover {
    transform: translateY(-6px);
    border-color: rgba(255,255,255,0.15);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 140px;
    border-radius: 50%;
    opacity: 0.18;
    transition: opacity 0.3s ease;
    filter: blur(40px);
  }

  .stat-card:hover::before { opacity: 0.32; }

  .stat-card.red::before   { background: #dc2626; box-shadow: 0 0 60px 10px rgba(220,38,38,0.4); }
  .stat-card.blue::before  { background: #2563eb; box-shadow: 0 0 60px 10px rgba(37,99,235,0.4); }
  .stat-card.green::before { background: #059669; box-shadow: 0 0 60px 10px rgba(5,150,105,0.4); }

  .stat-card.red:hover   { box-shadow: 0 20px 60px rgba(220,38,38,0.18); }
  .stat-card.blue:hover  { box-shadow: 0 20px 60px rgba(37,99,235,0.18); }
  .stat-card.green:hover { box-shadow: 0 20px 60px rgba(5,150,105,0.18); }

  .stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    margin-bottom: 1.2rem;
    font-size: 1.4rem;
  }

  .stat-card.red   .stat-icon { background: rgba(220,38,38,0.15);  }
  .stat-card.blue  .stat-icon { background: rgba(37,99,235,0.15);  }
  .stat-card.green .stat-icon { background: rgba(5,150,105,0.15); }

  .stat-label {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-bottom: 0.8rem;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 3.6rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    animation: countIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  .stat-card.red   .stat-value { color: #f87171; }
  .stat-card.blue  .stat-value { color: #60a5fa; }
  .stat-card.green .stat-value { color: #34d399; }

  .stat-card-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 0 0 20px 20px;
    opacity: 0.6;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  .stat-card:hover .stat-card-bar { transform: scaleX(1); }
  .stat-card.red   .stat-card-bar { background: linear-gradient(90deg, #dc2626, transparent); }
  .stat-card.blue  .stat-card-bar { background: linear-gradient(90deg, #2563eb, transparent); }
  .stat-card.green .stat-card-bar { background: linear-gradient(90deg, #059669, transparent); }

  .stat-error {
    font-size: 0.7rem;
    margin-top: 0.5rem;
    opacity: 0.5;
    color: #f87171;
  }

  .stat-loading {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: rgba(255,255,255,0.2);
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }

  @keyframes countIn {
    from { opacity: 0; transform: translateY(16px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const Admin = () => {
  const [totalUsers,    setTotalUsers]    = useState(null);
  const [totalBuses,    setTotalBuses]    = useState(null);
  const [totalBookings, setTotalBookings] = useState(null);

  const [usersError, setUsersError] = useState(null);
  const [busesError, setBusesError] = useState(null);

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalBuses();
    fetchTotalBookings();
  }, []);

  const fetchTotalUsers = async () => {
    setUsersError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:5000/api/admin/total-users", { headers });
      const count =
        res.data?.totalUsers ??
        res.data?.total ??
        res.data?.count ??
        (Array.isArray(res.data) ? res.data.length : null);
      if (count === null || count === undefined) {
        setUsersError("Unexpected response");
        setTotalUsers(0);
      } else {
        setTotalUsers(count);
      }
    } catch (error) {
      const msg =
        error.response?.status === 401 ? "Unauthorized (check token)" :
        error.response?.status === 404 ? "Endpoint not found" :
        error.message;
      setUsersError(msg);
      setTotalUsers(0);
    }
  };

  const fetchTotalBuses = async () => {
    setBusesError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:5000/api/buses", { headers });
      const count = Array.isArray(res.data)
        ? res.data.length
        : res.data?.buses?.length ??
          res.data?.total ??
          res.data?.count ??
          0;
      setTotalBuses(count);
    } catch (error) {
      const msg =
        error.response?.status === 401 ? "Unauthorized (check token)" :
        error.response?.status === 404 ? "Endpoint not found" :
        error.message;
      setBusesError(msg);
      setTotalBuses(0);
    }
  };

  
  const fetchTotalBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:5000/api/bookings/all", { headers }); 
      const count =
        res.data?.totalBookings ??
        res.data?.total ??
        res.data?.count ??
        (Array.isArray(res.data) ? res.data.length : null) ??
        0;
      setTotalBookings(count);
    } catch (error) {
      console.error("fetchTotalBookings failed:", error.message);
      setTotalBookings(0);
    }
  };

  const renderValue = (value, error) => {
    if (value === null) {
      return <p className="stat-loading">···</p>;
    }
    return (
      <>
        <p className="stat-value">{value}</p>
        {error && <p className="stat-error">⚠ {error}</p>}
      </>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <AdminNavbar />

      <div className="admin-root">
        <div className="admin-content">

          <div className="admin-header">
            <p className="admin-eyebrow">Control Panel</p>
            <h1 className="admin-title">
              Admin <span>Dashboard</span>
            </h1>
            <div className="admin-divider" />
          </div>

          <div className="admin-grid">

            <div className="stat-card red">
              <div className="stat-icon">👥</div>
              <p className="stat-label">Total Users</p>
              {renderValue(totalUsers, usersError)}
              <div className="stat-card-bar" />
            </div>

            <div className="stat-card blue">
              <div className="stat-icon">🚌</div>
              <p className="stat-label">Total Buses</p>
              {renderValue(totalBuses, busesError)}
              <div className="stat-card-bar" />
            </div>

            <div className="stat-card green">
              <div className="stat-icon">🎟️</div>
              <p className="stat-label">Total Bookings</p>
              {renderValue(totalBookings, null)}
              <div className="stat-card-bar" />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;