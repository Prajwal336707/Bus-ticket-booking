import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBus = () => {
  const navigate = useNavigate();
  const [busName, setBusName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [busType, setBusType] = useState("Sleeper");
  const [acType, setAcType] = useState("AC");
  const [price, setPrice] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");

  const handleAddBus = async (e) => {
    e.preventDefault();

    if (!busName || !from || !to || !departureTime || !arrivalTime || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/buses", {
        busName,
        from,
        to,
        departureTime,
        arrivalTime,
        price,
        busType,
        acType,
        totalSeats: 30
      });

      alert("Bus added successfully!");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Failed to add bus. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .addbuspage {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .addbuspage::before {
          content: '';
          position: absolute;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .addbuspage::after {
          content: '';
          position: absolute;
          bottom: -150px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .bus-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(234,179,8,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,179,8,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .card-wrapper {
          position: relative;
          width: 100%;
          max-width: 520px;
          z-index: 1;
        }

        .card-header {
          margin-bottom: 0;
        }

        .card-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .eyebrow-line {
          width: 32px;
          height: 2px;
          background: #eab308;
        }

        .eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #eab308;
        }

        .card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 0.03em;
          margin-bottom: 4px;
        }

        .card-title span {
          color: #eab308;
        }

        .card-subtitle {
          font-size: 13px;
          color: #555568;
          font-weight: 400;
          margin-bottom: 28px;
        }

        .form-card {
          background: #11111c;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(234,179,8,0.05),
            0 40px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(234,179,8,0.4), transparent);
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
        }

        .field-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555568;
          padding-left: 2px;
        }

        .field-input {
          width: 100%;
          padding: 13px 16px;
          background: #0a0a0f;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          color: #e8e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
        }

        .field-input::placeholder {
          color: #333345;
        }

        .field-input:focus {
          border-color: rgba(234,179,8,0.5);
          background: #0d0d17;
          box-shadow: 0 0 0 3px rgba(234,179,8,0.06), inset 0 0 12px rgba(234,179,8,0.02);
        }

        .field-input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.3) sepia(1) saturate(3) hue-rotate(5deg);
          opacity: 0.5;
          cursor: pointer;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 0;
        }

        .field-row .field-group {
          margin-bottom: 0;
        }

        .route-section {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          gap: 8px;
          margin-bottom: 16px;
        }

        .route-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 14px;
          color: #eab308;
          font-size: 18px;
          opacity: 0.7;
        }

        .route-arrow .field-group {
          margin-bottom: 0;
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.04);
          margin: 20px 0;
        }

        .badge-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: rgba(234,179,8,0.08);
          border: 1px solid rgba(234,179,8,0.15);
          border-radius: 20px;
          font-size: 11px;
          color: #eab308;
          font-weight: 500;
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #eab308;
        }

        /* Toggle group styles */
        .toggle-group {
          display: flex;
          gap: 0;
          background: #0a0a0f;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 3px;
          width: 100%;
          box-sizing: border-box;
        }

        .toggle-btn {
          flex: 1;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #555568;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          letter-spacing: 0.02em;
        }

        .toggle-btn.active {
          background: rgba(234,179,8,0.13);
          color: #eab308;
          box-shadow: 0 0 0 1px rgba(234,179,8,0.25);
        }

        .toggle-btn:hover:not(.active) {
          color: #a09a6a;
          background: rgba(255,255,255,0.03);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #eab308;
          border: none;
          border-radius: 8px;
          color: #0a0a0f;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
          margin-top: 8px;
          box-shadow: 0 4px 24px rgba(234,179,8,0.25);
        }

        .submit-btn:hover {
          background: #f5c518;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(234,179,8,0.35);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn::after {
          content: ' →';
          opacity: 0.7;
        }

        .bus-icon {
          font-size: 24px;
          position: absolute;
          top: 28px;
          right: 28px;
          opacity: 0.12;
        }
      `}</style>

      <div className="addbuspage">
        <div className="bus-grid-bg" />

        <div className="card-wrapper">
          <div className="card-header">
            <div className="card-eyebrow">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Admin Dashboard</span>
            </div>
            <h2 className="card-title">NEW <span>BUS</span></h2>
            <p className="card-subtitle">Register a new route to the fleet</p>
          </div>

          <div className="form-card">
            <div className="bus-icon">🚌</div>

            <div className="badge-row">
              <span className="badge"><span className="badge-dot" />{busType}</span>
              <span className="badge"><span className="badge-dot" />{acType}</span>
              <span className="badge"><span className="badge-dot" />30 Seats</span>
            </div>

            <form onSubmit={handleAddBus}>
              <div className="field-group">
                <label className="field-label">Bus Name</label>
                <input
                  type="text"
                  placeholder="e.g. Express Travels"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  className="field-input"
                />
              </div>

              <div className="route-section">
                <div className="field-group">
                  <label className="field-label">From</label>
                  <input
                    type="text"
                    placeholder="Origin city"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="field-input"
                  />
                </div>
                <div className="route-arrow">⟶</div>
                <div className="field-group">
                  <label className="field-label">To</label>
                  <input
                    type="text"
                    placeholder="Destination city"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="field-input"
                  />
                </div>
              </div>

              <div className="divider" />

              <div className="field-row" style={{ marginBottom: "16px" }}>
                <div className="field-group">
                  <label className="field-label">Bus Type</label>
                  <div className="toggle-group">
                    <button
                      type="button"
                      className={`toggle-btn${busType === "Sleeper" ? " active" : ""}`}
                      onClick={() => setBusType("Sleeper")}
                    >Sleeper</button>
                    <button
                      type="button"
                      className={`toggle-btn${busType === "Non-Sleeper" ? " active" : ""}`}
                      onClick={() => setBusType("Non-Sleeper")}
                    >Non-Sleeper</button>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">AC Type</label>
                  <div className="toggle-group">
                    <button
                      type="button"
                      className={`toggle-btn${acType === "AC" ? " active" : ""}`}
                      onClick={() => setAcType("AC")}
                    >AC</button>
                    <button
                      type="button"
                      className={`toggle-btn${acType === "Non-AC" ? " active" : ""}`}
                      onClick={() => setAcType("Non-AC")}
                    >Non-AC</button>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Departure</label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Arrival</label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="field-input"
                  />
                </div>
              </div>

              <div className="divider" />

              <div className="field-group">
                <label className="field-label">Ticket Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 850"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="field-input"
                />
              </div>

              <button type="submit" className="submit-btn">
                Register Bus
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBus;
