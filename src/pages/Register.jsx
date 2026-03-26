import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(response.data.message || "Registration Successful");
      setFormData({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: "👤" },
    { name: "email", type: "email", placeholder: "Email Address", icon: "✉️" },
    { name: "password", type: showPass ? "text" : "password", placeholder: "Password", icon: "🔒" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0d0d0d",
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-card {
          width: 100%;
          max-width: 440px;
          padding: 0 20px;
        }

        .reg-ticket {
          background: #141414;
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 6px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(220,38,38,0.05);
          overflow: hidden;
        }

        .ticket-header {
          background: linear-gradient(135deg, #b91c1c, #dc2626, #b91c1c);
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ticket-brand {
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .ticket-brand span {
          font-weight: 400;
          opacity: 0.65;
        }

        .ticket-right-label {
          font-family: 'Inter', sans-serif;
          font-size: 8px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          display: block;
          text-align: right;
        }

        .ticket-right-value {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          text-align: right;
        }

        .tear-line {
          display: flex;
          align-items: center;
          background: #0d0d0d;
          padding: 0 -9px;
        }

        .tear-notch {
          width: 18px;
          height: 18px;
          background: #0d0d0d;
          border-radius: 50%;
          flex-shrink: 0;
          margin: -9px -9px;
          z-index: 2;
          border: 1px solid rgba(220,38,38,0.25);
        }

        .tear-dashes {
          flex: 1;
          border-top: 2px dashed rgba(220,38,38,0.2);
          margin: 0 8px;
        }

        .route-strip {
          background: rgba(220,38,38,0.05);
          border-bottom: 1px solid rgba(220,38,38,0.12);
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .route-city-label {
          font-family: 'Inter', sans-serif;
          font-size: 8px;
          letter-spacing: 2px;
          color: rgba(220,38,38,0.5);
          text-transform: uppercase;
          display: block;
          margin-bottom: 3px;
          text-align: center;
        }

        .route-city-name {
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255,100,100,0.85);
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          text-align: center;
        }

        .route-middle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .route-line {
          width: 70px;
          height: 1px;
          background: linear-gradient(90deg, rgba(220,38,38,0.15), rgba(220,38,38,0.5), rgba(220,38,38,0.15));
        }

        .route-bus-icon {
          font-size: 20px;
        }

        .ticket-body {
          padding: 24px 28px 28px;
        }

        .reg-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 30px;
          font-weight: 600;
          color: #f5f5f5;
          letter-spacing: 5px;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 4px;
        }

        .reg-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(220,38,38,0.55);
          text-align: center;
          margin-bottom: 26px;
        }

        .reg-field-wrap {
          margin-bottom: 18px;
          position: relative;
        }

        .reg-field-label {
          font-family: 'Inter', sans-serif;
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(220,38,38,0.55);
          margin-bottom: 7px;
          display: block;
        }

        .reg-input-row {
          position: relative;
          display: flex;
          align-items: center;
        }

        .reg-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(220,38,38,0.35);
          color: #f5f5f5;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 300;
          padding: 12px 44px 12px 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          border-radius: 3px;
        }

        .reg-input::placeholder {
          color: rgba(255,255,255,0.15);
          font-size: 13px;
        }

        .reg-input:focus {
          background: rgba(220,38,38,0.05);
          border-color: rgba(220,38,38,0.4);
          border-bottom-color: rgba(220,38,38,0.8);
        }

        .reg-input-icon {
          position: absolute;
          right: 12px;
          font-size: 14px;
          opacity: 0.3;
          pointer-events: none;
        }

        .reg-toggle-pass {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: rgba(220,38,38,0.5);
          cursor: pointer;
          font-size: 10px;
          font-family: 'Inter', sans-serif;
          letter-spacing: 1px;
          padding: 0;
          text-transform: uppercase;
        }

        .reg-toggle-pass:hover { color: rgba(220,38,38,1); }

        .reg-btn {
          width: 100%;
          margin-top: 24px;
          padding: 14px;
          background: linear-gradient(135deg, rgba(185,28,28,0.35), rgba(220,38,38,0.25));
          border: 1px solid rgba(220,38,38,0.55);
          color: #f87171;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .reg-btn:hover {
          background: linear-gradient(135deg, rgba(185,28,28,0.55), rgba(220,38,38,0.4));
          border-color: rgba(220,38,38,0.9);
          color: #fca5a5;
        }

        .reg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .reg-spinner {
          display: inline-block;
          width: 11px;
          height: 11px;
          border: 1px solid rgba(220,38,38,0.3);
          border-top-color: #f87171;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .ticket-stub {
          border-top: 2px dashed rgba(220,38,38,0.15);
          padding: 16px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stub-text {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.22);
          margin-bottom: 4px;
        }

        .reg-login-btn {
          background: none;
          border: none;
          color: rgba(220,38,38,0.7);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1px;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(220,38,38,0.25);
          padding: 0;
        }

        .reg-login-btn:hover { color: #dc2626; }

        .barcode {
          display: flex;
          gap: 2px;
          align-items: flex-end;
          opacity: 0.2;
        }

        .barcode-bar {
          background: #dc2626;
          width: 2px;
          border-radius: 1px;
        }
      `}</style>

      <div className="reg-card">
        <div className="reg-ticket">

          {/* Header */}
          <div className="ticket-header">
            <div className="ticket-brand">Swift<span>Bus</span></div>
            <div>
              <span className="ticket-right-label">Passenger</span>
              <span className="ticket-right-value">Boarding Pass</span>
            </div>
          </div>

          {/* Tear line */}
          <div className="tear-line">
            <div className="tear-notch" />
            <div className="tear-dashes" />
            <div className="tear-notch" />
          </div>

          {/* Route strip */}
          <div className="route-strip">
            <div>
              <span className="route-city-label">From</span>
              <span className="route-city-name">Origin</span>
            </div>
            <div className="route-middle">
              <div className="route-line" />
              <span className="route-bus-icon">🚌</span>
              <div className="route-line" />
            </div>
            <div>
              <span className="route-city-label">To</span>
              <span className="route-city-name">Destination</span>
            </div>
          </div>

          {/* Form body */}
          <div className="ticket-body">
            <h1 className="reg-title">Register</h1>
            <p className="reg-subtitle">Create your traveller account</p>

            <form onSubmit={handleSubmit}>
              {fields.map(({ name, type, placeholder, icon }) => (
                <div key={name} className="reg-field-wrap">
                  <label className="reg-field-label">{placeholder}</label>
                  <div className="reg-input-row">
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(name)}
                      onBlur={() => setFocused(null)}
                      placeholder={placeholder}
                      required
                      className="reg-input"
                      autoComplete={name === "password" ? "new-password" : name}
                    />
                    {name === "password" ? (
                      <button type="button" className="reg-toggle-pass" onClick={() => setShowPass(v => !v)}>
                        {showPass ? "Hide" : "Show"}
                      </button>
                    ) : (
                      <span className="reg-input-icon">{icon}</span>
                    )}
                  </div>
                </div>
              ))}

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? <><span className="reg-spinner" />Booking seat...</> : "🎫  Create Account"}
              </button>
            </form>
          </div>

          {/* Stub */}
          <div className="ticket-stub">
            <div>
              <div className="stub-text">Already a traveller?</div>
              <button className="reg-login-btn" onClick={() => navigate("/login")}>Sign In →</button>
            </div>
            <div className="barcode">
              {[18,12,20,8,15,10,22,9,16,11,19,7,14,17,11].map((h, i) => (
                <div key={i} className="barcode-bar" style={{ height: `${h}px` }} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;