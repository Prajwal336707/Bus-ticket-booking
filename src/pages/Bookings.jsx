import React, { useEffect, useState } from "react";

const getDep = (b) =>
  b.departureTime ?? b.departure ?? b.depTime ?? b.dep_time ??
  b.scheduledDeparture ?? b.boardingTime ?? b.startTime ?? b.fromTime ?? null;

const getArr = (b) =>
  b.arrivalTime ?? b.arrival ?? b.arrTime ?? b.arr_time ??
  b.scheduledArrival ?? b.reachTime ?? b.endTime ?? b.toTime ?? null;

const getDur = (b) =>
  b.duration ?? b.travelDuration ?? b.journeyDuration ??
  b.tripDuration ?? b.timeTaken ?? b.totalTime ?? null;

const getPassengerName = (b) => {
  if (b.userId && typeof b.userId === "object" && b.userId.name) return b.userId.name;
  return b.passengerName || b.userName || "Traveller";
};

const genBars = (seed) => {
  const bars = []; let x = 0;
  for (let i = 0; i < 72; i++) {
    const w = ((seed * (i + 3) * 7) % 4) + 1;
    const black = (seed * i * 13 + i) % 3 !== 0;
    bars.push({ x, w, black }); x += w + 1;
  }
  return bars;
};
const seedOf = (s = "") => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

/* ══════════════════════════════════════════════════════════════
   VIEW TICKET  —  Premium Physical Boarding-Pass Style Ticket
══════════════════════════════════════════════════════════════ */
const ViewTicket = ({ booking: b, onBack, onCancel }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const dep   = getDep(b);
  const arr   = getArr(b);
  const dur   = getDur(b);
  const bars  = genBars(seedOf(b.bookingId || b._id || b.busName || "x"));
  const barsW = bars.reduce((a, bar) => a + bar.w + 1, 0);
  const from3 = (b.fromCity || "???").slice(0, 3).toUpperCase();
  const to3   = (b.toCity   || "???").slice(0, 3).toUpperCase();
  const passengerName = getPassengerName(b); 

  return (
    <div className={`vt-page ${mounted ? "vt-in" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .vt-page {
          position: fixed; inset: 0; z-index: 200;
          background: #0a0812; font-family: 'Syne', sans-serif;
          overflow-y: auto; opacity: 0; transform: translateY(30px);
          transition: opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1);
        }
        .vt-page.vt-in { opacity: 1; transform: translateY(0); }
        .vt-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 20% 0%, rgba(180,20,10,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, rgba(100,10,80,0.12) 0%, transparent 60%),
            #0a0812;
        }
        .vt-bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        .vt-nav {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .vt-back {
          display: flex; align-items: center; gap: 9px;
          background: none; border: none; color: rgba(255,255,255,0.5);
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: color .2s;
        }
        .vt-back:hover { color: #fff; }
        .vt-back-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; transition: border-color .2s, background .2s;
        }
        .vt-back:hover .vt-back-arrow { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); }
        .vt-nav-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 0.05em; }
        .vt-status-badge {
          display: flex; align-items: center; gap: 7px;
          background: rgba(0,180,80,0.1); border: 1px solid rgba(0,180,80,0.3);
          padding: 7px 16px; border-radius: 100px;
        }
        .vt-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #00c858; animation: vtPulse 1.4s ease infinite alternate; }
        @keyframes vtPulse { from { box-shadow: 0 0 0 0 rgba(0,200,88,.6); } to { box-shadow: 0 0 0 5px rgba(0,200,88,0); } }
        .vt-status-text { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #00c858; }

        .vt-content {
          position: relative; z-index: 5;
          max-width: 980px; margin: 0 auto;
          padding: 40px 32px 80px;
          display: grid; grid-template-columns: 1fr 300px; gap: 28px;
        }
        @media (max-width: 780px) { .vt-content { grid-template-columns: 1fr; } }

        .vt-ticket-outer {
          filter:
            drop-shadow(0 32px 64px rgba(0,0,0,0.7))
            drop-shadow(0 0 1px rgba(255,180,60,0.12));
          animation: ticketFloat 5s ease-in-out infinite;
        }
        @keyframes ticketFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40%       { transform: translateY(-5px) rotate(0.25deg); }
          70%       { transform: translateY(-2px) rotate(-0.15deg); }
        }

        .vt-ticket-top {
          background: linear-gradient(165deg, #fefaf0 0%, #f7ead4 35%, #f0dfc0 70%, #e8d4ae 100%);
          border-radius: 18px 18px 0 0;
          position: relative; overflow: hidden;
        }
        .vt-ticket-top::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.028) 30px, rgba(0,0,0,0.028) 31px);
        }
        .vt-ticket-top::after {
          content: 'BUS'; position: absolute; bottom: 16px; right: 20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 80px; font-weight: 700;
          color: rgba(0,0,0,0.04); letter-spacing: -0.05em;
          pointer-events: none; user-select: none; line-height: 1;
        }
        .vt-top-bar {
          height: 7px;
          background: linear-gradient(90deg, #8b1a1a 0%, #dc2626 30%, #ef4444 50%, #dc2626 70%, #8b1a1a 100%);
          border-radius: 18px 18px 0 0;
        }

        .vt-th {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 20px 32px 16px;
          border-bottom: 1px dashed rgba(0,0,0,0.12);
          position: relative; z-index: 1;
        }
        .vt-th-eyebrow { font-size: 8px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(0,0,0,0.32); margin-bottom: 3px; }
        .vt-th-name { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: #1a0808; line-height: 1; letter-spacing: 0.02em; }
        .vt-th-type { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; color: rgba(0,0,0,0.35); margin-top: 3px; text-transform: uppercase; }
        .vt-bp-tag {
          font-family: 'Space Mono', monospace; font-size: 8px; font-weight: 700;
          letter-spacing: 0.22em; color: #fff; background: #c0392b;
          padding: 5px 12px; border-radius: 3px; text-transform: uppercase;
          margin-top: 4px; display: inline-block;
          box-shadow: 0 2px 8px rgba(192,57,43,0.4);
        }

        .vt-cities { display: flex; align-items: center; padding: 24px 32px 20px; position: relative; z-index: 1; }
        .vt-city-code { font-family: 'Cormorant Garamond', serif; font-size: 84px; font-weight: 700; line-height: 1; color: #1a0808; letter-spacing: -0.04em; }
        .vt-city-full { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(0,0,0,0.35); margin-top: 3px; }
        .vt-city-time-pill {
          display: inline-flex; align-items: center; gap: 5px; margin-top: 10px;
          background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3);
          border-radius: 6px; padding: 5px 12px;
        }
        .vt-city-time-val { font-family: 'Space Mono', monospace; font-size: 20px; font-weight: 700; color: #c0392b; letter-spacing: 0.04em; }
        .vt-city-time-tag { font-size: 8px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(0,0,0,0.3); margin-top: 3px; }
        .vt-city-right { text-align: right; }
        .vt-city-right .vt-city-time-pill { justify-content: flex-end; }

        .vt-route-mid { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 0 20px 20px; }
        .vt-rl-row { width: 100%; display: flex; align-items: center; gap: 6px; }
        .vt-rl-dot { width: 11px; height: 11px; border-radius: 50%; background: #c0392b; flex-shrink: 0; box-shadow: 0 0 10px rgba(192,57,43,0.5); }
        .vt-rl-track { flex: 1; height: 2px; position: relative; background: repeating-linear-gradient(90deg, rgba(192,57,43,0.7) 0, rgba(192,57,43,0.7) 5px, transparent 5px, transparent 11px); }
        .vt-rl-bus { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f7ead4; padding: 0 7px; font-size: 19px; line-height: 1; }
        .vt-route-dur { font-family: 'Space Mono', monospace; font-size: 9px; color: rgba(0,0,0,0.35); letter-spacing: 0.1em; background: rgba(0,0,0,0.06); padding: 3px 12px; border-radius: 100px; }

        .vt-info-bar { display: flex; border-top: 1px dashed rgba(0,0,0,0.12); border-bottom: 1px dashed rgba(0,0,0,0.12); position: relative; z-index: 1; }
        .vt-ic { flex: 1; padding: 14px 18px; border-right: 1px dashed rgba(0,0,0,0.12); }
        .vt-ic:last-child { border-right: none; }
        .vt-ic-label { font-size: 8px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(0,0,0,0.28); margin-bottom: 6px; }
        .vt-ic-val { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: #1a0808; line-height: 1; }
        .vt-ic-val.mono { font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 400; color: #2a1010; letter-spacing: 0.04em; }

        .vt-seats-row { display: flex; align-items: center; gap: 14px; padding: 14px 32px; border-bottom: 1px dashed rgba(0,0,0,0.12); position: relative; z-index: 1; }
        .vt-seats-lbl { font-size: 8px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(0,0,0,0.28); flex-shrink: 0; }
        .vt-seats { display: flex; gap: 7px; flex-wrap: wrap; }
        .vt-seat { background: #c0392b; color: #fff; font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 5px; letter-spacing: 0.06em; box-shadow: 0 2px 8px rgba(192,57,43,0.4); }

        .vt-pax-row { display: flex; align-items: center; gap: 14px; padding: 16px 32px; position: relative; z-index: 1; }
        .vt-pax-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #c0392b, #7c1515); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(192,57,43,0.35); }
        .vt-pax-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #1a0808; line-height: 1; }
        .vt-pax-meta { font-size: 10px; color: rgba(0,0,0,0.35); margin-top: 2px; letter-spacing: 0.04em; }
        .vt-pax-amount { margin-left: auto; text-align: right; }
        .vt-pax-amount-lbl { font-size: 8px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(0,0,0,0.28); margin-bottom: 3px; }
        .vt-pax-amount-val { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: #c0392b; line-height: 1; }

        .vt-tear { display: flex; align-items: center; background: #0a0812; position: relative; z-index: 2; }
        .vt-tear-notch { width: 28px; height: 28px; border-radius: 50%; background: #0a0812; flex-shrink: 0; margin: 0 -14px; z-index: 3; border: 1px solid rgba(255,255,255,0.04); }
        .vt-tear-dashes { flex: 1; border-top: 2px dashed rgba(255,255,255,0.1); margin: 14px 0; }
        .vt-tear-label { position: absolute; left: 50%; transform: translateX(-50%); font-family: 'Space Mono', monospace; font-size: 7px; color: rgba(255,255,255,0.15); letter-spacing: 0.28em; text-transform: uppercase; background: #0a0812; padding: 0 12px; white-space: nowrap; }

        .vt-stub { background: linear-gradient(160deg, #1e1010 0%, #150a0a 100%); border-radius: 0 0 18px 18px; padding: 22px 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; position: relative; overflow: hidden; }
        .vt-stub::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(192,57,43,0.04) 8px, rgba(192,57,43,0.04) 16px); }
        .vt-stub-left { position: relative; z-index: 1; }
        .vt-stub-ref-lbl { font-size: 7px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 5px; }
        .vt-stub-ref { font-family: 'Space Mono', monospace; font-size: 15px; font-weight: 700; color: rgba(255,200,160,0.85); letter-spacing: 0.1em; }
        .vt-stub-date { font-size: 10px; color: rgba(255,255,255,0.22); margin-top: 4px; }
        .vt-confirmed-stamp { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(-10deg); border: 2px solid rgba(0,200,88,0.35); border-radius: 7px; padding: 4px 14px; z-index: 1; }
        .vt-confirmed-text { font-family: 'Space Mono', monospace; font-size: 11px; color: rgba(0,200,88,0.45); letter-spacing: 0.22em; text-transform: uppercase; }
        .vt-barcode-wrap { position: relative; z-index: 1; text-align: right; }
        .vt-barcode-lbl { font-family: 'Space Mono', monospace; font-size: 7px; color: rgba(255,255,255,0.18); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px; text-align: center; }

        .vt-card { background: #111118; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; margin-bottom: 16px; }
        .vt-card-hd { background: linear-gradient(135deg, #18080a, #120608); padding: 14px 22px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .vt-card-title { font-size: 9px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(220,30,30,0.6); }
        .vt-card-bd { padding: 20px 22px; }
        .vt-sum-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .vt-sum-row:last-child { border-bottom: none; }
        .vt-sum-key { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.27); }
        .vt-sum-val { font-family: 'Space Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.6); text-align: right; }
        .vt-sum-row.timing { background: rgba(220,30,30,0.07); border-radius: 8px; padding: 11px 10px; margin: 0 -10px; border-bottom: none; margin-bottom: 3px; }
        .vt-sum-row.timing .vt-sum-key { color: rgba(255,120,100,0.75); font-weight: 700; }
        .vt-sum-row.timing .vt-sum-val { font-size: 14px; font-weight: 700; color: #ff6a6a; letter-spacing: 0.06em; }
        .vt-btn-cancel { width: 100%; background: transparent; border: 1px solid rgba(220,30,30,0.3); color: rgba(220,30,30,0.8); padding: 14px; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all .2s; }
        .vt-btn-cancel:hover { background: rgba(220,30,30,0.1); border-color: rgba(220,30,30,0.65); }
      `}</style>

      <div className="vt-bg" />
      <div className="vt-bg-grid" />

      <nav className="vt-nav">
        <button className="vt-back" onClick={onBack}>
          <span className="vt-back-arrow">←</span>
          My Bookings
        </button>
        <div className="vt-nav-title">E-Ticket</div>
        <div className="vt-status-badge">
          <div className="vt-status-dot" />
          <span className="vt-status-text">Confirmed</span>
        </div>
      </nav>

      <div className="vt-content">

        {/* ══════ TICKET COLUMN ══════ */}
        <div>
          <div className="vt-ticket-outer">
            <div className="vt-ticket-top">
              <div className="vt-top-bar" />

              <div className="vt-th">
                <div>
                  <div className="vt-th-eyebrow">Bus Operator</div>
                  <div className="vt-th-name">{b.busName}</div>
                  <div className="vt-th-type">{b.busType || "Express Service"}</div>
                </div>
                <div className="vt-bp-tag">Boarding Pass</div>
              </div>

              <div className="vt-cities">
                <div className="vt-city">
                  <div className="vt-city-code">{from3}</div>
                  <div className="vt-city-full">{b.fromCity}</div>
                  {dep && (
                    <>
                      <div className="vt-city-time-pill">
                        <span style={{ fontSize: 11, opacity: .7 }}>🕐</span>
                        <span className="vt-city-time-val">{dep}</span>
                      </div>
                      <div className="vt-city-time-tag">Departure</div>
                    </>
                  )}
                </div>

                <div className="vt-route-mid">
                  <div className="vt-rl-row">
                    <div className="vt-rl-dot" />
                    <div className="vt-rl-track"><div className="vt-rl-bus">🚌</div></div>
                    <div className="vt-rl-dot" />
                  </div>
                  {dur && <div className="vt-route-dur">{dur}</div>}
                </div>

                <div className="vt-city vt-city-right">
                  <div className="vt-city-code">{to3}</div>
                  <div className="vt-city-full">{b.toCity}</div>
                  {arr && (
                    <>
                      <div className="vt-city-time-pill" style={{ justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 11, opacity: .7 }}>🕐</span>
                        <span className="vt-city-time-val">{arr}</span>
                      </div>
                      <div className="vt-city-time-tag" style={{ textAlign: "right" }}>Arrival</div>
                    </>
                  )}
                </div>
              </div>

              <div className="vt-info-bar">
                <div className="vt-ic">
                  <div className="vt-ic-label">Travel Date</div>
                  <div className="vt-ic-val mono">{b.travelDate}</div>
                </div>
                <div className="vt-ic">
                  <div className="vt-ic-label">Bus Type</div>
                  <div className="vt-ic-val" style={{ fontSize: 16 }}>{b.busType || "—"}</div>
                </div>
                <div className="vt-ic">
                  <div className="vt-ic-label">Total Seats</div>
                  <div className="vt-ic-val">{(b.seats || []).length}</div>
                </div>
              </div>

              <div className="vt-seats-row">
                <div className="vt-seats-lbl">Seat No.</div>
                <div className="vt-seats">
                  {(b.seats || []).map((s, i) => <div key={i} className="vt-seat">{s}</div>)}
                </div>
              </div>

              <div className="vt-pax-row">
                <div className="vt-pax-avatar">👤</div>
                <div>
                  <div className="vt-pax-name">{passengerName}</div>
                  <div className="vt-pax-meta">{b.busType} · {(b.seats || []).join(", ")}</div>
                </div>
                <div className="vt-pax-amount">
                  <div className="vt-pax-amount-lbl">Amount Paid</div>
                  <div className="vt-pax-amount-val">₹{b.totalAmount}</div>
                </div>
              </div>
            </div>

            <div className="vt-tear">
              <div className="vt-tear-notch" />
              <div className="vt-tear-dashes" />
              <div className="vt-tear-label">passenger copy · do not fold · non-transferable</div>
              <div className="vt-tear-dashes" />
              <div className="vt-tear-notch" />
            </div>

            <div className="vt-stub">
              <div className="vt-stub-left">
                <div className="vt-stub-ref-lbl">Booking Reference</div>
                <div className="vt-stub-ref">{b.bookingId || (b._id ? b._id.toString().slice(-8).toUpperCase() : "—")}</div>
                <div className="vt-stub-date">{b.travelDate} · {b.busType}</div>
              </div>
              <div className="vt-confirmed-stamp">
                <div className="vt-confirmed-text">✓ Confirmed</div>
              </div>
              <div className="vt-barcode-wrap">
                <svg width="130" height="48" viewBox={`0 0 ${barsW} 38`} preserveAspectRatio="none">
                  {bars.map((bar, i) =>
                    bar.black ? <rect key={i} x={bar.x} y={0} width={bar.w} height={38} fill="rgba(255,210,170,0.75)" /> : null
                  )}
                </svg>
                <div className="vt-barcode-lbl">{(b.bookingId || b._id || "").toString().replace(/-/g, "").slice(-12).toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ SIDEBAR ══════ */}
        <div>
          <div className="vt-card">
            <div className="vt-card-hd"><div className="vt-card-title">Journey Summary</div></div>
            <div className="vt-card-bd">
              {[["From", b.fromCity], ["To", b.toCity]].map(([k, v]) => (
                <div key={k} className="vt-sum-row">
                  <span className="vt-sum-key">{k}</span>
                  <span className="vt-sum-val">{v}</span>
                </div>
              ))}

              {dep && (
                <div className="vt-sum-row timing">
                  <span className="vt-sum-key">⏱ Departure</span>
                  <span className="vt-sum-val">{dep}</span>
                </div>
              )}
              {arr && (
                <div className="vt-sum-row timing">
                  <span className="vt-sum-key">⏱ Arrival</span>
                  <span className="vt-sum-val">{arr}</span>
                </div>
              )}
              {dur && (
                <div className="vt-sum-row timing">
                  <span className="vt-sum-key">⏱ Duration</span>
                  <span className="vt-sum-val">{dur}</span>
                </div>
              )}

              {[["Bus", b.busName], ["Date", b.travelDate]].map(([k, v]) => (
                <div key={k} className="vt-sum-row">
                  <span className="vt-sum-key">{k}</span>
                  <span className="vt-sum-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="vt-btn-cancel" onClick={() => onCancel(b)}>
            Cancel Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   BOOKINGS LIST PAGE
══════════════════════════════════════════ */
const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [viewing,  setViewing]  = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setBookings([]); setLoadingBookings(false); return; }

        const res = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) { setBookings([]); setLoadingBookings(false); return; }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingToCancel) => {
    const ok = window.confirm(`Cancel booking from ${bookingToCancel.fromCity} to ${bookingToCancel.toCity}?`);
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/bookings/${bookingToCancel._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Cancel failed:", err);
    }

    setBookings(bookings.filter((b) => b._id !== bookingToCancel._id));
    setViewing(null);
  };

  if (viewing) {
    return (
      <ViewTicket
        booking={viewing}
        onBack={() => setViewing(null)}
        onCancel={(b) => { handleCancel(b); setViewing(null); }}
      />
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bg-scene{position:fixed;inset:0;z-index:0;overflow:hidden;background:#050508;}
        .bg-sky{position:absolute;inset:0;background:linear-gradient(to bottom,#04040e 0%,#0c0c20 38%,#1c0a0a 72%,#100507 100%);}
        .bg-stars{position:absolute;inset:0;background-image:radial-gradient(1px 1px at 8% 12%,rgba(255,255,255,0.65) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 22% 6%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(1px 1px at 37% 18%,rgba(255,255,255,0.75) 0%,transparent 100%),radial-gradient(1px 1px at 52% 4%,rgba(255,255,255,0.55) 0%,transparent 100%),radial-gradient(1px 1px at 66% 14%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(2px 2px at 30% 3%,rgba(255,255,255,0.8) 0%,transparent 100%);}
        .bg-moon{position:absolute;top:7%;right:10%;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fffbe8 0%,#ffe896 40%,transparent 70%);box-shadow:0 0 50px 24px rgba(255,210,60,0.1);}
        .bg-hills{position:absolute;bottom:28%;left:0;right:0;height:220px;}
        .hill{position:absolute;bottom:0;border-radius:50% 50% 0 0;}
        .hill-1{width:36%;height:170px;left:-4%;background:#0b0b18;}.hill-2{width:30%;height:140px;left:17%;background:#0d0d1e;}.hill-3{width:42%;height:190px;left:34%;background:#090914;}.hill-4{width:32%;height:150px;left:63%;background:#0c0c1a;}.hill-5{width:26%;height:120px;right:-2%;background:#0a0a16;}
        .bg-trees{position:absolute;bottom:27.5%;left:0;right:0;pointer-events:none;}
        .tree-g{position:absolute;bottom:0;}
        .tree-g::before,.tree-g::after{content:'';position:absolute;left:50%;transform:translateX(-50%);border-style:solid;border-color:transparent;}
        .tree-g::before{border-width:0 5px 22px 5px;border-bottom-color:#060610;bottom:14px;}
        .tree-g::after{border-width:0 8px 32px 8px;border-bottom-color:#060610;bottom:0;}
        .bg-road{position:absolute;bottom:0;left:0;right:0;height:29%;background:linear-gradient(to bottom,#0c0c10 0%,#111116 40%);border-top:1px solid rgba(255,255,255,0.035);}
        .road-dash-track{position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:3px;overflow:hidden;}
        .rdash{position:absolute;width:100%;height:55px;background:rgba(255,220,100,0.22);animation:dashScroll 0.75s linear infinite;}
        @keyframes dashScroll{0%{transform:translateY(-100%);}100%{transform:translateY(1800%);}}
        .road-edge{position:absolute;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,transparent,rgba(255,210,70,0.14) 20%,rgba(255,210,70,0.14) 80%,transparent);}
        .road-edge.left{left:14%;}.road-edge.right{right:14%;}
        .lstreak{position:absolute;width:2px;background:linear-gradient(to bottom,transparent 0%,rgba(220,30,30,0.5) 30%,rgba(220,30,30,0.8) 55%,rgba(255,80,80,0.35) 80%,transparent 100%);animation:streakPass linear infinite;}
        .ls1{left:4%;height:65%;top:10%;animation-duration:1.15s;}.ls2{left:7%;height:48%;top:22%;animation-duration:.88s;animation-delay:.28s;opacity:.65;}.ls3{right:4%;height:65%;top:10%;animation-duration:1.08s;animation-delay:.14s;}.ls4{right:7%;height:48%;top:22%;animation-duration:.82s;animation-delay:.52s;opacity:.65;}
        @keyframes streakPass{0%{transform:translateY(-120%);opacity:0;}12%{opacity:1;}88%{opacity:1;}100%{transform:translateY(130%);opacity:0;}}
        .bg-bus-wrap{position:absolute;bottom:25%;left:50%;transform:translateX(-50%);z-index:3;animation:busBounce 3.2s ease-in-out infinite;}
        @keyframes busBounce{0%,100%{transform:translateX(-50%) translateY(0);}25%{transform:translateX(-50%) translateY(-2.5px);}75%{transform:translateX(-50%) translateY(1.2px);}}
        .bus{position:relative;width:240px;height:90px;}
        .bus-body{position:absolute;bottom:16px;left:14px;right:14px;height:62px;background:linear-gradient(to bottom,#14141f,#0c0c14);border-radius:6px 8px 4px 4px;border:1px solid rgba(255,255,255,0.07);}
        .bus-roof{position:absolute;top:-9px;left:18px;right:18px;height:13px;background:#0e0e18;border-radius:5px 5px 0 0;border:1px solid rgba(255,255,255,0.05);border-bottom:none;}
        .bus-windows{position:absolute;top:9px;left:14px;right:14px;display:flex;gap:5px;}
        .bwin{flex:1;height:20px;border-radius:2px;background:rgba(255,200,80,0.1);border:1px solid rgba(255,200,80,0.16);animation:winFlicker 4s ease-in-out infinite;}
        .bwin:nth-child(2){animation-delay:.6s;}.bwin:nth-child(3){animation-delay:1.2s;}.bwin:nth-child(4){animation-delay:1.8s;}.bwin:nth-child(5){animation-delay:2.4s;}
        @keyframes winFlicker{0%,88%,100%{background:rgba(255,200,80,0.1);}94%{background:rgba(255,200,80,0.03);}}
        .bus-stripe{position:absolute;bottom:8px;left:14px;right:14px;height:3px;background:linear-gradient(90deg,transparent,rgba(220,30,30,.8),transparent);}
        .bus-front-cap{position:absolute;right:0;bottom:16px;width:18px;height:62px;background:#0d0d17;border-radius:0 8px 4px 0;border:1px solid rgba(255,255,255,0.06);border-left:none;}
        .bus-hl{position:absolute;right:-8px;bottom:18px;width:22px;height:12px;background:rgba(255,245,190,0.95);border-radius:2px;box-shadow:0 0 18px 8px rgba(255,240,160,.5);}
        .bus-beam{position:absolute;right:14px;bottom:17px;width:0;height:0;border-top:14px solid transparent;border-bottom:14px solid transparent;border-left:100px solid rgba(255,240,150,0.06);}
        .bus-tl{position:absolute;left:10px;bottom:18px;display:flex;flex-direction:column;gap:5px;}
        .tlight{width:9px;height:5px;background:rgba(220,30,30,0.95);border-radius:1px;box-shadow:0 0 10px 4px rgba(220,30,30,.55);animation:tlPulse 1.8s ease-in-out infinite;}
        .tlight:nth-child(2){animation-delay:.9s;}
        @keyframes tlPulse{0%,100%{opacity:1;}50%{opacity:.45;}}
        .exhaust-wrap{position:absolute;left:0;bottom:24px;}
        .puff{position:absolute;border-radius:50%;background:rgba(200,190,210,0.12);animation:puffOut ease-out infinite;}
        .p1{width:12px;height:12px;animation-duration:1.4s;}.p2{width:8px;height:8px;animation-duration:1.1s;animation-delay:.3s;}.p3{width:10px;height:10px;animation-duration:1.3s;animation-delay:.6s;}
        @keyframes puffOut{0%{transform:translate(0,0) scale(.5);opacity:.5;}100%{transform:translate(-35px,-20px) scale(2.5);opacity:0;}}
        .bwheel{position:absolute;bottom:0;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#1c1c28,#0a0a12);border:2px solid rgba(255,255,255,0.09);animation:wSpin .45s linear infinite;}
        .bwheel::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);}
        @keyframes wSpin{0%{transform:rotate(0);}100%{transform:rotate(360deg);}}
        .wf{right:10px;}.wr{left:22px;}
        .road-glow{position:absolute;bottom:24%;left:50%;transform:translateX(-50%);width:220px;height:50px;background:radial-gradient(ellipse,rgba(220,30,30,0.1) 0%,transparent 70%);}
        .bg-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.42);}
        .bookings-root{position:relative;z-index:1;min-height:100vh;font-family:'DM Sans',sans-serif;padding:60px 40px 80px;color:#e8e0d8;}
        .bookings-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:56px;position:relative;}
        .bookings-header::after{content:'';position:absolute;bottom:-20px;left:0;width:100%;height:1px;background:linear-gradient(90deg,rgba(220,30,30,0.6) 0%,rgba(220,30,30,0.05) 60%,transparent 100%);}
        .header-eyebrow{font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:#c0392b;margin-bottom:8px;}
        .header-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:900;color:#f0e8e0;line-height:1;}
        .header-title span{color:#dc1e1e;}
        .bookings-grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));}
        .ticket-card{position:relative;background:rgba(19,19,26,0.82);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;transition:transform .3s,box-shadow .3s;animation:fadeSlideUp .5s ease both;}
        .ticket-card:hover{transform:translateY(-4px);box-shadow:0 24px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(220,30,30,0.2);}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        .ticket-card:nth-child(1){animation-delay:.05s;}.ticket-card:nth-child(2){animation-delay:.12s;}.ticket-card:nth-child(3){animation-delay:.19s;}
        .ticket-stripe{height:4px;background:linear-gradient(90deg,#dc1e1e 0%,#ff6b6b 50%,#dc1e1e 100%);background-size:200% 100%;animation:shimmer 3s linear infinite;}
        @keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
        .ticket-body{padding:24px 26px;}
        .ticket-route{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
        .city-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#f0e8e0;}
        .route-arrow{display:flex;flex-direction:column;align-items:center;flex:1;}
        .route-line{width:100%;height:1px;background:linear-gradient(90deg,rgba(220,30,30,0.4),rgba(220,30,30,0.8),rgba(220,30,30,0.4));position:relative;}
        .route-dot{width:6px;height:6px;border-radius:50%;background:#dc1e1e;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 8px #dc1e1e;}
        .ticket-bus{font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#5a5450;margin-bottom:6px;}
        .ticket-bus-name{font-size:14px;font-weight:500;color:#8a8278;margin-bottom:20px;}
        .ticket-divider{display:flex;align-items:center;margin:20px 0;}
        .divider-notch{width:20px;height:20px;border-radius:50%;background:rgba(8,8,12,0.9);border:1px solid rgba(255,255,255,0.07);flex-shrink:0;}
        .divider-notch.right{margin-left:auto;}
        .divider-line{flex:1;border-top:2px dashed rgba(255,255,255,0.08);margin:0 -1px;}
        .card-actions{display:flex;gap:10px;}
        .view-btn{flex:1;background:linear-gradient(135deg,#dc1e1e 0%,#b01515 100%);border:none;color:#fff;padding:12px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all .2s;}
        .view-btn:hover{box-shadow:0 8px 24px rgba(220,30,30,0.4);transform:translateY(-1px);}
        .cancel-btn-card{background:transparent;border:1px solid rgba(255,255,255,0.1);color:#5a5450;padding:12px 14px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
        .cancel-btn-card:hover{border-color:rgba(220,30,30,0.45);color:#dc1e1e;}
        .empty-state{text-align:center;padding:100px 20px;}
        .empty-icon{font-size:64px;margin-bottom:20px;opacity:0.3;}
        .empty-text{font-family:'Playfair Display',serif;font-size:22px;color:#3a3530;font-weight:700;}
      `}</style>

      <div className="bg-scene">
        <div className="bg-sky"/><div className="bg-stars"/><div className="bg-moon"/>
        <div className="bg-hills">
          <div className="hill hill-1"/><div className="hill hill-2"/><div className="hill hill-3"/><div className="hill hill-4"/><div className="hill hill-5"/>
        </div>
        <div className="bg-trees">
          {[5,10,16,20,26,32,38,44,50,56,62,68,74,80,86,92].map((l,i)=>(
            <div key={i} className="tree-g" style={{left:`${l}%`,height:`${30+(i%3)*12}px`,width:'16px'}}/>
          ))}
        </div>
        <div className="bg-road">
          <div className="road-edge left"/><div className="road-edge right"/>
          <div className="road-dash-track">
            {[...Array(14)].map((_,i)=><div key={i} className="rdash" style={{animationDelay:`${-(i*.0535)}s`,top:`${i*100}px`}}/>)}
          </div>
        </div>
        <div className="lstreak ls1"/><div className="lstreak ls2"/><div className="lstreak ls3"/><div className="lstreak ls4"/>
        <div className="bg-bus-wrap">
          <div className="bus">
            <div className="bus-body">
              <div className="bus-roof"/>
              <div className="bus-windows"><div className="bwin"/><div className="bwin"/><div className="bwin"/><div className="bwin"/><div className="bwin"/></div>
              <div className="bus-stripe"/>
              <div className="bus-tl"><div className="tlight"/><div className="tlight"/></div>
              <div className="exhaust-wrap"><div className="puff p1"/><div className="puff p2"/><div className="puff p3"/></div>
            </div>
            <div className="bus-front-cap"><div className="bus-hl"/></div>
            <div className="bus-beam"/>
            <div className="bwheel wf"/><div className="bwheel wr"/>
          </div>
        </div>
        <div className="road-glow"/>
        <div className="bg-overlay"/>
      </div>

      <div className="bookings-root">
        <div className="bookings-header">
          <div>
            <p className="header-eyebrow">Travel History</p>
            <h2 className="header-title">My <span>Bookings</span></h2>
          </div>
        </div>
        {loadingBookings ? (
          <div className="empty-state">
            <div className="empty-icon">🔄</div>
            <p className="empty-text" style={{ color: "#5a5450" }}>Loading your bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <p className="empty-text">No bookings yet</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking, i) => (
              <div key={i} className="ticket-card">
                <div className="ticket-stripe"/>
                <div className="ticket-body">
                  <p className="ticket-bus">Operator</p>
                  <p className="ticket-bus-name">{booking.busName}</p>
                  <div className="ticket-route">
                    <span className="city-name">{booking.fromCity}</span>
                    <div className="route-arrow">
                      <div className="route-line"><div className="route-dot"/></div>
                    </div>
                    <span className="city-name">{booking.toCity}</span>
                  </div>
                  <div className="ticket-divider">
                    <div className="divider-notch"/><div className="divider-line"/><div className="divider-notch right"/>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => setViewing(booking)} className="view-btn">View Ticket</button>
                    <button onClick={() => handleCancel(booking)} className="cancel-btn-card">Cancel</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings;
