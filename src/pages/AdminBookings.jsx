import React, { useState, useEffect } from "react";
import axios from "axios";

const genBars = (seed) => {
  const bars = []; let x = 0;
  for (let i = 0; i < 52; i++) {
    const w = ((seed * (i + 3) * 7) % 3) + 1;
    const black = (seed * i * 13 + i) % 3 !== 0;
    bars.push({ x, w, black }); x += w + 1;
  }
  return bars;
};
const seedOf = (s = "") => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

const getPassengerName = (b) => {
  if (b.userId && typeof b.userId === "object" && b.userId.name) return b.userId.name;
  return b.userName || b.passengerName || "Unknown User";
};

const getPassengerEmail = (b) => {
  if (b.userId && typeof b.userId === "object" && b.userId.email) return b.userId.email;
  return b.userEmail || b.email || "";
};

/* ══════════════════════════════════════════
   DETAIL PANEL
══════════════════════════════════════════ */
const DetailPanel = ({ booking: b, onClose }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);
  const bars  = genBars(seedOf(b._id || b.bookingId || "xx"));
  const barsW = bars.reduce((a, bar) => a + bar.w + 1, 0);

  const name  = getPassengerName(b);
  const email = getPassengerEmail(b);

  return (
    <div className={`dp-overlay ${mounted ? "dp-in" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .dp-overlay{position:fixed;inset:0;z-index:300;display:flex;align-items:flex-start;justify-content:flex-end;opacity:0;transition:opacity .3s ease;}
        .dp-overlay.dp-in{opacity:1;}
        .dp-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);}
        .dp-panel{position:relative;z-index:1;width:460px;height:100vh;overflow-y:auto;background:#0c0c14;border-left:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;transform:translateX(40px);transition:transform .4s cubic-bezier(.22,1,.36,1);}
        .dp-overlay.dp-in .dp-panel{transform:translateX(0);}
        .dp-header{padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;background:#0e0e18;position:sticky;top:0;z-index:10;}
        .dp-eyebrow{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(220,30,30,0.6);margin-bottom:4px;}
        .dp-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:#f0e8e0;}
        .dp-title-email{font-size:11px;color:rgba(255,255,255,0.3);margin-top:3px;font-family:'Space Mono',monospace;letter-spacing:0.03em;}
        .dp-close{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.4);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-family:'Syne',sans-serif;}
        .dp-close:hover{border-color:rgba(255,255,255,0.3);color:#fff;background:rgba(255,255,255,0.06);}
        .dp-body{padding:28px;flex:1;}
        .dp-ticket{background:linear-gradient(135deg,#13080a 0%,#0e0610 100%);border:1px solid rgba(220,30,30,0.18);border-radius:16px;overflow:hidden;margin-bottom:24px;}
        .dp-ticket-header{padding:22px 24px 18px;position:relative;}
        .dp-ticket-header::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(220,30,30,0.03) 8px,rgba(220,30,30,0.03) 16px);}
        .dp-route{position:relative;z-index:1;display:flex;align-items:center;gap:12px;margin-bottom:16px;}
        .dp-city-code{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:#fff;line-height:1;letter-spacing:-0.04em;}
        .dp-city-sub{font-size:9px;font-weight:700;letter-spacing:0.2em;color:rgba(255,255,255,0.3);text-transform:uppercase;margin-top:3px;}
        .dp-route-mid{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .dp-rl{width:100%;height:1px;background:repeating-linear-gradient(90deg,rgba(220,30,30,0.5) 0,rgba(220,30,30,0.5) 5px,transparent 5px,transparent 10px);position:relative;}
        .dp-rl-bus{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#13080a;padding:0 6px;font-size:14px;}
        .dp-busname-badge{background:rgba(220,30,30,0.12);border:1px solid rgba(220,30,30,0.25);border-radius:6px;padding:3px 10px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;color:#ff8080;letter-spacing:0.06em;text-align:center;max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .dp-times{position:relative;z-index:1;display:flex;justify-content:space-between;}
        .dp-time-item{text-align:center;}
        .dp-time-val{font-family:'Space Mono',monospace;font-size:20px;font-weight:700;color:#ff6a6a;letter-spacing:0.04em;}
        .dp-time-label{font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-top:3px;}
        .dp-ticket-divider{display:flex;align-items:center;background:#080810;border-top:1px solid rgba(220,30,30,0.12);border-bottom:1px solid rgba(220,30,30,0.12);}
        .dp-notch{width:18px;height:18px;border-radius:50%;background:#0c0c14;margin:0 -9px;flex-shrink:0;}
        .dp-dash{flex:1;border-top:1px dashed rgba(255,255,255,0.08);}
        .dp-ticket-footer{padding:18px 24px;display:flex;justify-content:space-between;align-items:center;}
        .dp-ref-label{font-size:8px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:5px;}
        .dp-ref{font-family:'Space Mono',monospace;font-size:11px;color:rgba(255,255,255,0.55);letter-spacing:0.08em;}
        .dp-seats{display:flex;gap:5px;flex-wrap:wrap;margin-top:10px;}
        .dp-seat{background:rgba(220,30,30,0.12);border:1px solid rgba(220,30,30,0.3);color:#ff6060;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;padding:4px 10px;border-radius:4px;}
        .dp-section{margin-bottom:20px;}
        .dp-section-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(220,30,30,0.5);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.05);}
        .dp-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .dp-info-key{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:4px;}
        .dp-info-val{font-family:'Space Mono',monospace;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:0.03em;}
        .dp-info-val.highlight{color:#ff8080;font-size:13px;}
        .dp-amount-row{display:flex;align-items:baseline;gap:4px;margin:16px 0 4px;}
        .dp-amt-cur{font-family:'Space Mono',monospace;font-size:16px;color:rgba(220,30,30,0.7);font-weight:700;}
        .dp-amt-val{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:#ff4040;line-height:1;letter-spacing:-0.03em;}
        .dp-amt-label{font-family:'Syne',sans-serif;font-size:9px;color:rgba(255,255,255,0.2);letter-spacing:0.15em;text-transform:uppercase;}
        .dp-confirmed-stamp{display:inline-flex;align-items:center;gap:8px;background:rgba(0,200,88,0.08);border:1px solid rgba(0,200,88,0.25);border-radius:10px;padding:10px 16px;margin-bottom:20px;}
        .dp-confirmed-dot{width:8px;height:8px;border-radius:50%;background:#00c858;box-shadow:0 0 8px rgba(0,200,88,0.6);flex-shrink:0;animation:dpPulse 1.4s ease infinite alternate;}
        @keyframes dpPulse{from{box-shadow:0 0 0 0 rgba(0,200,88,.6);}to{box-shadow:0 0 0 5px rgba(0,200,88,0);}}
        .dp-confirmed-text{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#00c858;}
        .dp-actions-footer{padding:20px 28px;border-top:1px solid rgba(255,255,255,0.06);background:#0a0a12;position:sticky;bottom:0;}
        .dp-del-btn{width:100%;background:transparent;border:1px solid rgba(220,30,30,0.25);color:rgba(220,30,30,0.6);padding:13px;border-radius:10px;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all .2s;}
        .dp-del-btn:hover{background:rgba(220,30,30,0.08);border-color:rgba(220,30,30,0.5);color:#ff4040;}
      `}</style>

      <div className="dp-backdrop" onClick={onClose} />
      <div className="dp-panel">
        <div className="dp-header">
          <div>
            <div className="dp-eyebrow">Booking Detail</div>
            <div className="dp-title">{name}</div>
            {email && <div className="dp-title-email">{email}</div>}
          </div>
          <button className="dp-close" onClick={onClose}>✕</button>
        </div>

        <div className="dp-body">
          {/* TICKET VISUAL */}
          <div className="dp-ticket">
            <div className="dp-ticket-header">
              <div className="dp-route">
                <div>
                  <div className="dp-city-code">{(b.fromCity||"???").slice(0,3).toUpperCase()}</div>
                  <div className="dp-city-sub">{b.fromCity}</div>
                </div>
                <div className="dp-route-mid">
                  <div className="dp-rl"><div className="dp-rl-bus">🚌</div></div>
                  <div className="dp-busname-badge">{b.busName || "Unknown Bus"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="dp-city-code">{(b.toCity||"???").slice(0,3).toUpperCase()}</div>
                  <div className="dp-city-sub" style={{textAlign:"right"}}>{b.toCity}</div>
                </div>
              </div>
              <div className="dp-times">
                <div className="dp-time-item">
                  <div className="dp-time-val">{b.travelDate || "—"}</div>
                  <div className="dp-time-label">Travel Date</div>
                </div>
                <div className="dp-time-item">
                  <div className="dp-time-val">₹{b.totalAmount || 0}</div>
                  <div className="dp-time-label">Amount</div>
                </div>
              </div>
            </div>
            <div className="dp-ticket-divider">
              <div className="dp-notch" />
              <div className="dp-dash" />
              <div className="dp-notch" />
            </div>
            <div className="dp-ticket-footer">
              <div>
                <div className="dp-ref-label">Booking ID</div>
                <div className="dp-ref">{b._id || b.bookingId || "—"}</div>
                <div className="dp-seats">{(b.seats||[]).map((s,i)=><div key={i} className="dp-seat">{s}</div>)}</div>
              </div>
              <svg width="90" height="36" viewBox={`0 0 ${barsW} 30`} preserveAspectRatio="none">
                {bars.map((bar, i) => bar.black ? <rect key={i} x={bar.x} y={0} width={bar.w} height={30} fill="rgba(255,255,255,0.6)" /> : null)}
              </svg>
            </div>
          </div>

          {/* CONFIRMED STAMP — replaces status buttons */}
          <div className="dp-confirmed-stamp">
            <div className="dp-confirmed-dot" />
            <div className="dp-confirmed-text">✓ Booking Confirmed</div>
          </div>

          {/* PAYMENT */}
          <div className="dp-section">
            <div className="dp-section-label">Payment</div>
            <div className="dp-amount-row">
              <div className="dp-amt-cur">₹</div>
              <div className="dp-amt-val">{b.totalAmount || 0}</div>
            </div>
            <div className="dp-amt-label">Total Amount Paid</div>
          </div>

          {/* JOURNEY INFO */}
          <div className="dp-section">
            <div className="dp-section-label">Journey Details</div>
            <div className="dp-info-grid">
              {[
                ["Passenger",    name],
                ["Email",        email || "—"],
                ["Bus Name",     b.busName || "—"],
                ["From",         b.fromCity || "—"],
                ["To",           b.toCity || "—"],
                ["Travel Date",  b.travelDate || "—"],
                ["Seats",        (b.seats||[]).join(", ") || "—"],
                ["Total Amount", `₹${b.totalAmount || 0}`],
                ["Booked At",    b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="dp-info-key">{k}</div>
                  <div className={`dp-info-val${k === "Bus Name" ? " highlight" : ""}`}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dp-actions-footer">
          <button className="dp-del-btn" onClick={() => { if(window.confirm("Delete this booking?")) onClose(); }}>
            ✕ Delete Booking
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   ADMIN MAIN PAGE
══════════════════════════════════════════ */
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState("newest");
  const [selected, setSelected] = useState(null);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase();
      const name  = getPassengerName(b).toLowerCase();
      const email = getPassengerEmail(b).toLowerCase();
      return !q
        || name.includes(q)
        || email.includes(q)
        || (b._id||"").toLowerCase().includes(q)
        || (b.fromCity||"").toLowerCase().includes(q)
        || (b.toCity||"").toLowerCase().includes(q)
        || (b.busName||"").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "newest")   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")   return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "amount-h") return b.totalAmount - a.totalAmount;
      if (sort === "amount-l") return a.totalAmount - b.totalAmount;
      return 0;
    });

  const totalRevenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(220,30,30,0.3);border-radius:2px;}
        .admin-root{min-height:100vh;background:#060609;font-family:'Syne',sans-serif;color:#e8e0d8;opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s cubic-bezier(.22,1,.36,1);}
        .admin-root.in{opacity:1;transform:translateY(0);}
        .admin-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 15% 0%,rgba(180,20,10,0.14) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 85% 100%,rgba(80,10,60,0.1) 0%,transparent 60%),#060609;}
        .admin-bg-grid{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%);}
        .admin-top{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:20px 36px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(6,6,9,0.9);backdrop-filter:blur(12px);}
        .admin-logo{display:flex;align-items:center;gap:12px;}
        .admin-logo-icon{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#dc1e1e,#8b0000);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 16px rgba(220,30,30,0.4);}
        .admin-logo-text{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:#f0e8e0;letter-spacing:0.02em;}
        .admin-logo-sub{font-size:9px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(220,30,30,0.5);margin-top:1px;}
        .admin-top-right{display:flex;align-items:center;gap:16px;}
        .admin-tag{background:rgba(220,30,30,0.1);border:1px solid rgba(220,30,30,0.25);border-radius:100px;padding:6px 14px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(220,30,30,0.7);}
        .admin-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,rgba(220,30,30,0.4),rgba(100,10,10,0.5));border:2px solid rgba(220,30,30,0.25);display:flex;align-items:center;justify-content:center;font-size:16px;}
        .admin-layout{position:relative;z-index:5;max-width:1400px;margin:0 auto;padding:36px 36px 80px;}
        .admin-page-title{margin-bottom:32px;}
        .admin-eyebrow{font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(220,30,30,0.6);margin-bottom:8px;}
        .admin-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,3.5vw,2.8rem);font-weight:700;color:#f0e8e0;line-height:1;}
        .admin-h1 span{color:#dc1e1e;}
        .admin-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:32px;}
        @media(max-width:600px){.admin-stats{grid-template-columns:1fr;}}
        .stat-card{background:rgba(14,14,22,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:22px 24px;position:relative;overflow:hidden;transition:border-color .2s;}
        .stat-card:hover{border-color:rgba(220,30,30,0.2);}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--stat-accent);}
        .stat-label{font-size:9px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.22);margin-bottom:12px;}
        .stat-value{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:#f0e8e0;line-height:1;margin-bottom:4px;}
        .stat-sub{font-size:10px;color:rgba(255,255,255,0.22);letter-spacing:0.05em;}
        .stat-icon{position:absolute;right:18px;top:18px;font-size:22px;opacity:0.2;}
        .admin-controls{display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap;}
        .search-wrap{flex:1;min-width:220px;position:relative;}
        .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;opacity:.35;pointer-events:none;}
        .admin-search{width:100%;background:rgba(14,14,22,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:11px 14px 11px 38px;font-family:'Syne',sans-serif;font-size:13px;color:#e8e0d8;outline:none;transition:border-color .2s;}
        .admin-search::placeholder{color:rgba(255,255,255,0.2);}
        .admin-search:focus{border-color:rgba(220,30,30,0.35);}
        .sort-select{background:rgba(14,14,22,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:11px 14px;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;color:rgba(255,255,255,0.5);outline:none;cursor:pointer;transition:border-color .2s;}
        .sort-select:focus{border-color:rgba(220,30,30,0.35);}
        .sort-select option{background:#0c0c14;}
        .result-count{font-size:11px;color:rgba(255,255,255,0.22);margin-bottom:16px;letter-spacing:0.05em;}
        .result-count strong{color:rgba(255,255,255,0.5);}
        .admin-table-wrap{background:rgba(10,10,16,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;}
        .admin-table{width:100%;border-collapse:collapse;}
        .admin-th{padding:14px 20px;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.22);text-align:left;border-bottom:1px solid rgba(255,255,255,0.05);white-space:nowrap;}
        .admin-th:first-child{padding-left:24px;}
        .admin-th:last-child{padding-right:24px;text-align:right;}
        .admin-tr{border-bottom:1px solid rgba(255,255,255,0.03);transition:background .15s;cursor:pointer;animation:rowIn .4s ease both;}
        @keyframes rowIn{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}
        .admin-tr:hover{background:rgba(220,30,30,0.04);}
        .admin-tr:last-child{border-bottom:none;}
        .admin-td{padding:16px 20px;vertical-align:middle;}
        .admin-td:first-child{padding-left:24px;}
        .admin-td:last-child{padding-right:24px;text-align:right;}
        .td-booking-id{font-family:'Space Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.04em;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .td-passenger{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:#f0e8e0;line-height:1.1;}
        .td-passenger-meta{font-size:10px;color:rgba(255,255,255,0.28);margin-top:2px;letter-spacing:0.04em;}
        .td-route{display:flex;align-items:center;gap:8px;}
        .td-city{font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:0.04em;}
        .td-arrow{font-size:10px;color:rgba(220,30,30,0.5);}
        .td-bus-name{display:inline-block;margin-top:5px;background:rgba(220,30,30,0.1);border:1px solid rgba(220,30,30,0.22);border-radius:5px;padding:2px 8px;font-size:10px;font-weight:700;color:#ff8080;letter-spacing:0.04em;}
        .td-date{font-family:'Space Mono',monospace;font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:0.04em;}
        .td-seats{display:flex;gap:4px;flex-wrap:wrap;}
        .td-seat{background:rgba(220,30,30,0.1);border:1px solid rgba(220,30,30,0.25);color:rgba(255,100,80,0.8);font-family:'Space Mono',monospace;font-size:9px;font-weight:700;padding:3px 8px;border-radius:4px;}
        .td-amount{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:#ff4040;letter-spacing:-0.02em;}
        .td-confirmed{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;background:rgba(0,200,88,0.1);border:1px solid rgba(0,200,88,0.3);color:#00c858;}
        .td-confirmed-dot{width:5px;height:5px;border-radius:50%;background:#00c858;flex-shrink:0;animation:tdPulse 1.4s ease infinite alternate;}
        @keyframes tdPulse{from{box-shadow:0 0 0 0 rgba(0,200,88,.6);}to{box-shadow:0 0 0 4px rgba(0,200,88,0);}}
        .td-actions-btn{background:transparent;border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.35);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:14px;display:inline-flex;align-items:center;justify-content:center;transition:all .2s;font-family:'Syne',sans-serif;}
        .td-actions-btn:hover{border-color:rgba(220,30,30,0.35);color:#ff6a6a;background:rgba(220,30,30,0.07);}
        .empty-row td{padding:60px 24px;text-align:center;}
        .empty-icon-lg{font-size:40px;opacity:0.15;display:block;margin-bottom:12px;}
        .empty-msg{font-family:'Cormorant Garamond',serif;font-size:18px;color:rgba(255,255,255,0.15);}
        .loading-state{text-align:center;padding:80px 24px;font-family:'Cormorant Garamond',serif;font-size:20px;color:rgba(255,255,255,0.2);}
        .error-state{text-align:center;padding:60px 24px;font-family:'Space Mono',monospace;font-size:12px;color:rgba(220,30,30,0.6);background:rgba(220,30,30,0.05);border-radius:12px;border:1px solid rgba(220,30,30,0.15);}
      `}</style>

      <div className={`admin-root ${mounted ? "in" : ""}`}>
        <div className="admin-bg" />
        <div className="admin-bg-grid" />

        <header className="admin-top">
          <div className="admin-logo">
            <div className="admin-logo-icon">🚌</div>
            <div>
              <div className="admin-logo-text">BusAdmin</div>
              <div className="admin-logo-sub">Control Panel</div>
            </div>
          </div>
          <div className="admin-top-right">
            <div className="admin-tag">Admin</div>
            <div className="admin-avatar">👤</div>
          </div>
        </header>

        <div className="admin-layout">
          <div className="admin-page-title">
            <div className="admin-eyebrow">Operations Dashboard</div>
            <h1 className="admin-h1">All User <span>Bookings</span></h1>
          </div>

          {/* 2 stats only — Revenue + Total Bookings */}
          <div className="admin-stats">
            {[
              { label: "Total Revenue",   value: `₹${totalRevenue}`,    sub: "All confirmed bookings", accent: "linear-gradient(90deg,#dc1e1e,#ff6b6b)", icon: "💰" },
              { label: "Total Bookings",  value: bookings.length,        sub: "Registered in system",   accent: "linear-gradient(90deg,#00c858,#00ff88)", icon: "🎫" },
            ].map((s, i) => (
              <div className="stat-card" key={i} style={{"--stat-accent": s.accent}}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="admin-controls">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input className="admin-search"
                placeholder="Search by name, email, city or bus..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-h">Amount: High</option>
              <option value="amount-l">Amount: Low</option>
            </select>
          </div>

          <div className="result-count">
            Showing <strong>{filtered.length}</strong> booking{filtered.length !== 1 ? "s" : ""}
            {search && <> · "<strong>{search}</strong>"</>}
          </div>

          <div className="admin-table-wrap">
            {loading ? (
              <div className="loading-state">⏳ Loading bookings from database...</div>
            ) : error ? (
              <div className="error-state">⚠ {error}</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="admin-th">Booking ID</th>
                    <th className="admin-th">Passenger</th>
                    <th className="admin-th">Route & Bus</th>
                    <th className="admin-th">Travel Date</th>
                    <th className="admin-th">Seats</th>
                    <th className="admin-th">Amount</th>
                    <th className="admin-th">Status</th>
                    <th className="admin-th">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={8}>
                        <span className="empty-icon-lg">🎫</span>
                        <div className="empty-msg">No bookings found</div>
                      </td>
                    </tr>
                  ) : filtered.map((b, i) => {
                    const name  = getPassengerName(b);
                    const email = getPassengerEmail(b);
                    return (
                      <tr key={b._id || i} className="admin-tr"
                        style={{ animationDelay: `${i * 0.04}s` }}
                        onClick={() => setSelected(b)}>

                        <td className="admin-td">
                          <div className="td-booking-id">{b._id}</div>
                        </td>

                        <td className="admin-td">
                          <div className="td-passenger">{name}</div>
                          <div className="td-passenger-meta">{email}</div>
                        </td>

                        <td className="admin-td">
                          <div className="td-route">
                            <span className="td-city">{b.fromCity}</span>
                            <span className="td-arrow">→</span>
                            <span className="td-city">{b.toCity}</span>
                          </div>
                          <div className="td-bus-name">🚌 {b.busName || "—"}</div>
                        </td>

                        <td className="admin-td">
                          <div className="td-date">{b.travelDate || "—"}</div>
                        </td>

                        <td className="admin-td">
                          <div className="td-seats">
                            {(b.seats || []).map((s, j) => <div key={j} className="td-seat">{s}</div>)}
                          </div>
                        </td>

                        <td className="admin-td">
                          <div className="td-amount">₹{b.totalAmount || 0}</div>
                        </td>

                        <td className="admin-td">
                          <span className="td-confirmed">
                            <span className="td-confirmed-dot" />
                            Confirmed
                          </span>
                        </td>

                        <td className="admin-td" onClick={e => e.stopPropagation()}>
                          <button className="td-actions-btn"
                            onClick={() => setSelected(b)}
                            title="View Details">⊕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <DetailPanel
          booking={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
