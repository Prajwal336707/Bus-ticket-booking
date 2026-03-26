import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  .acc-root * { box-sizing: border-box; }
  .acc-root { min-height: 100vh; background: #0e0e0e; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 14px; }

  /* HERO */
  .acc-hero {
    background: linear-gradient(135deg, #cc0000 0%, #ff3333 60%, #ff5555 100%);
    padding: 44px 24px 80px;
    position: relative;
    overflow: hidden;
  }
  .acc-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
  .acc-hero::after {
    content: '';
    position: absolute; right: -60px; bottom: -60px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .acc-hero-inner {
    max-width: 860px; margin: 0 auto;
    display: flex; align-items: center; gap: 24px;
    position: relative; z-index: 1;
  }
  .acc-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 2.5px solid rgba(255,255,255,0.45);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
    color: #fff; flex-shrink: 0;
    box-shadow: 0 8px 30px rgba(0,0,0,0.35), 0 0 0 6px rgba(255,255,255,0.06);
    letter-spacing: -0.02em;
  }
  .acc-hero-name {
    font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800;
    color: #fff; letter-spacing: -0.02em; line-height: 1.1;
  }
  .acc-hero-email { color: rgba(255,255,255,0.68); font-size: 13px; margin-top: 5px; font-weight: 300; }
  .acc-badge {
    display: inline-flex; align-items: center; gap: 5px; margin-top: 12px;
    background: #ffd700; color: #2a1800;
    font-size: 11px; font-weight: 700; font-family: 'Syne', sans-serif;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 20px;
    box-shadow: 0 4px 12px rgba(255,215,0,0.3);
  }

  /* CONTENT */
  .acc-content {
    max-width: 860px; margin: -40px auto 0;
    padding: 0 20px 80px; position: relative; z-index: 10;
  }

  /* STATS */
  .acc-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
  .acc-stat {
    background: #1c1c1c; border: 1px solid #282828;
    border-radius: 14px; padding: 20px 14px; text-align: center;
    position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
    cursor: default;
  }
  .acc-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #e60000, transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .acc-stat:hover { border-color: #3a3a3a; transform: translateY(-2px); }
  .acc-stat:hover::before { opacity: 1; }
  .acc-stat-value {
    font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800;
    color: #e60000; letter-spacing: -0.03em; line-height: 1;
  }
  .acc-stat-label {
    font-size: 10px; color: #555; text-transform: uppercase;
    letter-spacing: 0.14em; margin-top: 6px; font-weight: 500;
  }

  /* MAIN CARD */
  .acc-card { background: #1c1c1c; border: 1px solid #282828; border-radius: 16px; overflow: hidden; }

  /* TABS */
  .acc-tabs { display: flex; background: #161616; border-bottom: 1px solid #282828; }
  .acc-tab {
    flex: 1; padding: 16px 10px; background: none; border: none;
    border-bottom: 2.5px solid transparent;
    color: #555; font-size: 13px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; letter-spacing: 0.02em;
    cursor: pointer; transition: color 0.2s, border-color 0.2s;
  }
  .acc-tab.active { border-bottom-color: #e60000; color: #e60000; }
  .acc-tab:hover:not(.active) { color: #aaa; }
  .acc-tab-body { padding: 28px 28px 32px; }

  /* PROFILE */
  .acc-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .acc-field {
    background: #141414; border: 1px solid #272727;
    border-radius: 11px; padding: 15px 17px;
    transition: border-color 0.2s;
  }
  .acc-field:hover { border-color: #363636; }
  .acc-field-label {
    font-size: 9.5px; color: #555; text-transform: uppercase;
    letter-spacing: 0.14em; margin-bottom: 7px;
    font-family: 'Syne', sans-serif; font-weight: 600;
  }
  .acc-field-value { font-size: 14.5px; color: #ddd; }
  .acc-btn-row { display: flex; gap: 12px; }
  .acc-btn-primary {
    background: #e60000; color: #fff; border: none;
    padding: 11px 24px; border-radius: 9px;
    font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(230,0,0,0.35);
  }
  .acc-btn-primary:hover { background: #cc0000; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(230,0,0,0.45); }
  .acc-btn-ghost {
    background: none; color: #aaa; border: 1px solid #333;
    padding: 11px 24px; border-radius: 9px;
    font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .acc-btn-ghost:hover { border-color: #555; color: #ddd; }

  /* BOOKINGS */
  .acc-bookings { display: flex; flex-direction: column; gap: 12px; }
  .acc-booking {
    background: #141414; border: 1px solid #272727;
    border-radius: 13px; padding: 17px 20px;
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color 0.2s, transform 0.2s;
  }
  .acc-booking:hover { border-color: #383838; transform: translateX(2px); }
  .acc-booking-id {
    font-size: 9.5px; color: #555; letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 5px;
    font-family: 'Syne', sans-serif; font-weight: 600;
  }
  .acc-booking-route {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
    color: #fff; letter-spacing: -0.01em;
  }
  .acc-booking-arrow { color: #e60000; margin: 0 4px; }
  .acc-booking-meta { font-size: 12px; color: #555; margin-top: 5px; }
  .acc-booking-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .acc-status-upcoming {
    font-size: 10.5px; font-weight: 700; font-family: 'Syne', sans-serif;
    letter-spacing: 0.06em; padding: 4px 11px; border-radius: 20px;
    background: rgba(0,196,112,0.12); color: #00c470;
    border: 1px solid rgba(0,196,112,0.28);
  }
  .acc-status-completed {
    font-size: 10.5px; font-weight: 700; font-family: 'Syne', sans-serif;
    letter-spacing: 0.06em; padding: 4px 11px; border-radius: 20px;
    background: rgba(255,255,255,0.04); color: #555;
    border: 1px solid #2a2a2a;
  }
  .acc-btn-ticket {
    background: #e60000; color: #fff; border: none;
    padding: 6px 13px; border-radius: 7px;
    font-size: 11px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: background 0.2s;
    box-shadow: 0 3px 10px rgba(230,0,0,0.3);
  }
  .acc-btn-ticket:hover { background: #cc0000; }

  /* SETTINGS */
  .acc-setting-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 17px 0; border-bottom: 1px solid #222;
  }
  .acc-setting-row:last-of-type { border-bottom: none; }
  .acc-setting-label { font-size: 14px; color: #ccc; font-weight: 500; margin-bottom: 3px; }
  .acc-setting-desc { font-size: 12px; color: #555; }
  .acc-toggle {
    width: 46px; height: 25px; border-radius: 13px;
    position: relative; cursor: pointer; flex-shrink: 0;
    transition: background 0.25s; border: none;
  }
  .acc-toggle-dot {
    width: 19px; height: 19px; background: #fff; border-radius: 50%;
    position: absolute; top: 3px;
    transition: left 0.25s cubic-bezier(.4,0,.2,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
  .acc-btn-danger {
    background: none; color: #e66;
    border: 1px solid rgba(200,50,50,0.28);
    padding: 10px 20px; border-radius: 9px;
    font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 24px;
    transition: background 0.2s, border-color 0.2s;
    display: block;
  }
  .acc-btn-danger:hover { background: rgba(200,50,50,0.08); border-color: rgba(200,50,50,0.5); }
`;

const Toggle = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className="acc-toggle"
    style={{ background: on ? "#e60000" : "#2e2e2e", boxShadow: on ? "0 2px 10px rgba(230,0,0,0.35)" : "none" }}
  >
    <div className="acc-toggle-dot" style={{ left: on ? 24 : 3 }} />
  </button>
);

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [settings, setSettings] = useState({ email: true, sms: false, promo: true });

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "?";

  const bookings = [
    { id: "BK-1042", from: "New York", to: "Boston", date: "Mar 15, 2026", status: "Upcoming", seats: 2 },
    { id: "BK-0987", from: "Boston", to: "Philadelphia", date: "Feb 28, 2026", status: "Completed", seats: 1 },
    { id: "BK-0891", from: "Chicago", to: "Detroit", date: "Jan 10, 2026", status: "Completed", seats: 3 },
  ];

  const tabs = ["Profile", "My Bookings", "Settings"];

  const settingsList = [
    { key: "email", label: "Email Notifications", desc: "Booking confirmations and updates" },
    { key: "sms",   label: "SMS Alerts",           desc: "Text reminders before your trip" },
    { key: "promo", label: "Promo Offers",          desc: "Deals and discount alerts" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="acc-root">

        {/* HERO */}
        <div className="acc-hero">
          <div className="acc-hero-inner">
            <div className="acc-avatar">{initials}</div>
            <div>
              <div className="acc-hero-name">{user?.name || "Guest"}</div>
              <div className="acc-hero-email">{user?.email || "No email found"}</div>
              <div className="acc-badge">⭐ Verified Traveller</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="acc-content">

          {/* STATS */}
          <div className="acc-stats">
            {[{ v: "12", l: "Total Trips" }, { v: "3", l: "Upcoming" }, { v: "9", l: "Completed" }].map(s => (
              <div key={s.l} className="acc-stat">
                <div className="acc-stat-value">{s.v}</div>
                <div className="acc-stat-label">{s.l}</div>
              </div>
            ))}
          </div>

          {/* MAIN CARD */}
          <div className="acc-card">

            {/* TABS */}
            <div className="acc-tabs">
              {tabs.map(t => (
                <button
                  key={t}
                  className={`acc-tab${activeTab === t ? " active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* TAB BODY */}
            <div className="acc-tab-body">

              {/* PROFILE */}
              {activeTab === "Profile" && (
                <div>
                  <div className="acc-profile-grid">
                    {[
                      { l: "Full Name",    v: user?.name  || "—" },
                      { l: "Email",        v: user?.email || "—" },
                      { l: "Phone",        v: user?.phone || "—" },
                      { l: "Member Since", v: user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                          : "—"
                      },
                    ].map(f => (
                      <div key={f.l} className="acc-field">
                        <div className="acc-field-label">{f.l}</div>
                        <div className="acc-field-value">{f.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="acc-btn-row">
                    <button className="acc-btn-primary">Edit Profile</button>
                    <button className="acc-btn-ghost">Change Password</button>
                  </div>
                </div>
              )}

              {/* MY BOOKINGS */}
              {activeTab === "My Bookings" && (
                <div className="acc-bookings">
                  {bookings.map(b => (
                    <div key={b.id} className="acc-booking">
                      <div>
                        <div className="acc-booking-id">{b.id}</div>
                        <div className="acc-booking-route">
                          {b.from} <span className="acc-booking-arrow">→</span> {b.to}
                        </div>
                        <div className="acc-booking-meta">
                          📅 {b.date} · 💺 {b.seats} seat{b.seats > 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="acc-booking-right">
                        <span className={b.status === "Upcoming" ? "acc-status-upcoming" : "acc-status-completed"}>
                          {b.status}
                        </span>
                        {b.status === "Upcoming" && (
                          <button className="acc-btn-ticket">View Ticket</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === "Settings" && (
                <div>
                  {settingsList.map(s => (
                    <div key={s.key} className="acc-setting-row">
                      <div>
                        <div className="acc-setting-label">{s.label}</div>
                        <div className="acc-setting-desc">{s.desc}</div>
                      </div>
                      <Toggle
                        on={settings[s.key]}
                        onToggle={() => setSettings(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                      />
                    </div>
                  ))}
                  <button className="acc-btn-danger">Delete Account</button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;