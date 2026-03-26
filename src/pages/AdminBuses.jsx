import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from "react-router-dom";

const AdminBuses = () => {

  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    const res = await axios.get("http://localhost:5000/api/buses");
    setBuses(res.data);
  };

  const deleteBus = async (id) => {

    const confirmDelete = window.confirm("Remove this bus?");
    if (!confirmDelete) return;

    await axios.delete(`http://localhost:5000/api/buses/${id}`);

    fetchBuses();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .buses-root {
          font-family: 'Syne', sans-serif;
          background: #0a0a0f;
          min-height: 100vh;
        }

        .buses-wrapper {
          padding-top: 96px;
          padding-left: 40px;
          padding-right: 40px;
          min-height: 100vh;
          background: #0a0a0f;
          background-image:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 60%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,0.015) 60px,
              rgba(255,255,255,0.015) 61px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,0.015) 60px,
              rgba(255,255,255,0.015) 61px
            );
        }

        .buses-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .buses-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          margin: 0;
          position: relative;
        }

        .buses-title::after {
          content: '';
          display: block;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          margin-top: 6px;
          border-radius: 2px;
        }

        .add-bus-btn {
          background: linear-gradient(135deg, #2563eb, #0891b2);
          color: #ffffff;
          padding: 10px 22px;
          border-radius: 8px;
          border: none;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(37,99,235,0.35);
        }

        .add-bus-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(37,99,235,0.55);
        }

        .table-container {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
        }

        .buses-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'DM Mono', monospace;
        }

        .buses-table thead {
          background: rgba(37,99,235,0.15);
          border-bottom: 1px solid rgba(59,130,246,0.25);
        }

        .buses-table thead tr th {
          padding: 14px 16px;
          text-align: left;
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #60a5fa;
        }

        .buses-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s ease;
        }

        .buses-table tbody tr:last-child {
          border-bottom: none;
        }

        .buses-table tbody tr:hover {
          background: rgba(59,130,246,0.06);
        }

        .buses-table tbody tr td {
          padding: 14px 16px;
          color: #d1d5db;
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .bus-name-cell {
          color: #f9fafb !important;
          font-weight: 500 !important;
          font-family: 'Syne', sans-serif !important;
          font-size: 0.875rem !important;
        }

        .route-cell {
          color: #94a3b8 !important;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .route-arrow {
          color: #3b82f6;
          font-style: normal;
        }

        .price-cell {
          color: #34d399 !important;
          font-weight: 500 !important;
        }

        .seats-cell {
          color: #fbbf24 !important;
        }

        .type-badge {
          display: inline-block;
          padding: 3px 10px;
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 20px;
          color: #a78bfa;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .remove-btn {
          background: rgba(220,38,38,0.12);
          color: #f87171;
          border: 1px solid rgba(220,38,38,0.3);
          padding: 6px 14px;
          border-radius: 6px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: rgba(220,38,38,0.25);
          border-color: rgba(220,38,38,0.6);
          color: #fca5a5;
          transform: translateY(-1px);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.2);
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          letter-spacing: 0.05em;
        }
      `}</style>

      <AdminNavbar />

      <div className="buses-root">
        <div className="buses-wrapper">

          <div className="buses-header">
            <h1 className="buses-title">All Buses</h1>

            <button
              onClick={() => navigate("/admin/add-bus")}
              className="add-bus-btn"
            >
              + Add Bus
            </button>
          </div>

          <div className="table-container">
            <table className="buses-table">
              <thead>
                <tr>
                  <th>Bus Name</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {buses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-state">No buses found</td>
                  </tr>
                ) : (
                  buses.map((bus) => (
                    <tr key={bus._id}>

                      <td className="bus-name-cell">{bus.busName}</td>
                      <td>
                        <span className="route-cell">
                          {bus.from} <span className="route-arrow">→</span> {bus.to}
                        </span>
                      </td>
                      <td>{bus.departureTime}</td>
                      <td>{bus.arrivalTime}</td>
                      <td><span className="type-badge">{bus.busType}</span></td>
                      <td className="price-cell">₹{bus.price}</td>
                      <td className="seats-cell">{bus.availableSeats}</td>

                      <td>
                        <button
                          onClick={() => deleteBus(bus._id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminBuses;
