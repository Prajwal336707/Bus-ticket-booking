import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ─── GLOBAL STYLES injected once ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink:    #f0ede6;
    --paper:  #0e0f13;
    --cream:  #1a1c23;
    --accent: #ff5533;
    --green:  #2dab5f;
    --muted:  #6b6d78;
    --card:   #14151b;
    --shadow: 0 4px 32px rgba(0,0,0,.45);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--paper);
    color: var(--ink);
  }

  /* ── page wrapper ── */
  .ss-page {
    min-height: 100vh;
    padding: 96px 24px 64px;
    background:
      radial-gradient(ellipse 80% 50% at 110% -10%, rgba(255,85,51,.10) 0%, transparent 55%),
      radial-gradient(ellipse 60% 60% at -10% 110%, rgba(45,171,95,.07) 0%, transparent 55%),
      var(--paper);
  }

  .ss-inner {
    max-width: 860px;
    margin: 0 auto;
  }

  /* ── hero header ── */
  .ss-header {
    margin-bottom: 48px;
  }

  .ss-eyebrow {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }

  .ss-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -.02em;
    color: var(--ink);
    margin-bottom: 20px;
  }

  .ss-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .ss-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--card);
    border: 1.5px solid #2a2c36;
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--ink);
    box-shadow: var(--shadow);
  }

  .ss-pill span.icon { font-size: 15px; }

  /* ── deck card ── */
  .ss-deck-card {
    background: var(--card);
    border: 1.5px solid #1f2130;
    border-radius: 20px;
    padding: 36px 28px 32px;
    margin-bottom: 24px;
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
  }

  .ss-deck-card::before {
    content: attr(data-label);
    position: absolute;
    top: 0; right: 0;
    font-family: 'Syne', sans-serif;
    font-size: 80px;
    font-weight: 800;
    color: #1e2030;
    line-height: 1;
    padding: 8px 20px 0 0;
    pointer-events: none;
    user-select: none;
  }

  .ss-deck-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ss-deck-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    background: #1e2030;
    color: var(--muted);
    border-radius: 100px;
    padding: 3px 10px;
  }

  /* ── bus body ── */
  .ss-bus-body {
    background: #0b0c10;
    border: 2px dashed #252733;
    border-radius: 14px;
    padding: 24px 32px;
    position: relative;
  }

  /* steering wheel indicator */
  .ss-bus-front {
    text-align: center;
    font-size: 22px;
    margin-bottom: 18px;
    opacity: .5;
  }

  /* ── seat grid ── */
  .ss-seats {
    display: flex;
    justify-content: center;
    gap: 24px;
    align-items: flex-start;
  }

  .ss-col { display: flex; flex-direction: column; gap: 10px; }

  .ss-aisle {
    width: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding-top: 0;
  }

  .ss-aisle-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #2a2c3a;
  }

  /* ── seat button ── */
  .ss-seat {
    width: 52px;
    height: 58px;
    border-radius: 10px 10px 8px 8px;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    position: relative;
    transition: transform .15s, box-shadow .15s;
    outline: none;
  }

  .ss-seat::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 8px; right: 8px;
    height: 6px;
    border-radius: 0 0 6px 6px;
    transition: inherit;
  }

  /* available */
  .ss-seat.available {
    background: linear-gradient(160deg, #3da865 0%, #2d8a4e 100%);
    color: #fff;
    box-shadow: 0 3px 0 #1d6336, 0 6px 16px rgba(45,138,78,.25);
  }
  .ss-seat.available::after { background: #1d6336; }
  .ss-seat.available:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #1d6336, 0 10px 24px rgba(45,138,78,.35);
  }
  .ss-seat.available:active { transform: translateY(1px); box-shadow: 0 1px 0 #1d6336; }

  /* selected */
  .ss-seat.selected {
    background: linear-gradient(160deg, #f05a34 0%, #e8401c 100%);
    color: #fff;
    box-shadow: 0 3px 0 #b02a10, 0 6px 16px rgba(232,64,28,.30);
    transform: translateY(-1px);
  }
  .ss-seat.selected::after { background: #b02a10; }

  /* booked */
  .ss-seat.booked {
    background: #1c1e28;
    color: #3a3d50;
    cursor: not-allowed;
    box-shadow: 0 2px 0 #13141c;
  }
  .ss-seat.booked::after { background: #13141c; }

  /* headrest line */
  .ss-seat-headrest {
    position: absolute;
    top: 7px; left: 10px; right: 10px;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,.3);
  }
  .ss-seat.booked .ss-seat-headrest { background: rgba(255,255,255,.03); }

  /* ── legend ── */
  .ss-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 32px 0 0;
    flex-wrap: wrap;
  }

  .ss-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--muted);
    font-weight: 500;
  }

  .ss-legend-dot {
    width: 14px; height: 14px;
    border-radius: 4px;
  }

  /* ── footer / summary bar ── */
  .ss-footer {
    position: sticky;
    bottom: 24px;
    margin-top: 40px;
  }

  .ss-summary-bar {
    background: #f0ede6;
    color: #0e0f13;
    border-radius: 16px;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-shadow: 0 8px 40px rgba(11,12,16,.22);
    flex-wrap: wrap;
  }

  .ss-summary-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ss-summary-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(14,15,19,.45);
  }

  .ss-summary-seats {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #0e0f13;
  }

  .ss-summary-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: var(--accent);
    font-size: 12px;
    font-weight: 800;
    margin-right: 6px;
  }

  .ss-pay-btn {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 28px;
    cursor: pointer;
    transition: background .15s, transform .1s;
    white-space: nowrap;
  }

  .ss-pay-btn:hover:not(:disabled) { background: #c83210; transform: translateY(-1px); }
  .ss-pay-btn:active:not(:disabled) { transform: translateY(0); }

  .ss-pay-btn:disabled {
    background: #c8c4bb;
    color: rgba(14,15,19,.35);
    cursor: not-allowed;
  }

  /* ── empty state ── */
  .ss-empty {
    text-align: center;
    padding: 80px 24px;
  }

  .ss-empty h2 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 20px;
  }

  .ss-back-btn {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 28px;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    .ss-seat { width: 44px; height: 50px; font-size: 12px; }
    .ss-seats { gap: 12px; }
    .ss-summary-bar { flex-direction: column; align-items: flex-start; }
  }
`;

/* ─── COMPONENT ───────────────────────────────────────────────────────── */
const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, fromCity, toCity, travelDate } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  if (!bus) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="ss-page">
          <div className="ss-empty">
            <h2>No Bus Selected</h2>
            <button className="ss-back-btn" onClick={() => navigate("/home")}>
              ← Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const totalSeats = 30;
  const upperDeckSeats = 15;
  const lowerDeckSeats = 15;

  useEffect(() => {
    const seed = bus._id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const randomBooked = [];
    const totalRandom = 6;
    let i = 0;

    while (randomBooked.length < totalRandom) {
      const seat = (seed + i * 7) % totalSeats + 1;
      if (!randomBooked.includes(seat)) randomBooked.push(seat);
      i++;
    }

    setBookedSeats(randomBooked);
  }, [bus]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    navigate("/payment", {
      state: { bus, selected: selectedSeats, fromCity, toCity, travelDate },
    });
  };

  const renderDeck = (startSeat, seatCount, deckName, label) => {
    const seats = Array.from({ length: seatCount }, (_, i) => startSeat + i);
    const leftSeats = seats.filter((_, i) => i % 2 === 0);
    const rightSeats = seats.filter((_, i) => i % 2 !== 0);

    const renderSeat = (seat) => {
      const isBooked = bookedSeats.includes(seat);
      const isSelected = selectedSeats.includes(seat);
      const cls = isBooked ? "booked" : isSelected ? "selected" : "available";

      return (
        <button
          key={seat}
          onClick={() => toggleSeat(seat)}
          className={`ss-seat ${cls}`}
          title={isBooked ? "Already booked" : `Seat ${seat}`}
        >
          <span className="ss-seat-headrest" />
          {seat}
        </button>
      );
    };

    const aisleCount = Math.min(leftSeats.length, rightSeats.length);

    return (
      <div className="ss-deck-card" data-label={label}>
        <div className="ss-deck-title">
          {deckName}
          <span className="ss-deck-badge">{seatCount} seats</span>
        </div>

        <div className="ss-bus-body">
          <div className="ss-bus-front">🚌</div>

          <div className="ss-seats">
            <div className="ss-col">{leftSeats.map(renderSeat)}</div>

            <div className="ss-aisle">
              {Array.from({ length: aisleCount * 2 }, (_, k) => (
                <div key={k} className="ss-aisle-dot" />
              ))}
            </div>

            <div className="ss-col">{rightSeats.map(renderSeat)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="ss-page">
        <div className="ss-inner">

          {/* Header */}
          <div className="ss-header">
            <p className="ss-eyebrow">Step 2 of 3 — Seat Selection</p>
            <h2 className="ss-title">Pick your<br />perfect seat</h2>
            <div className="ss-meta">
              <span className="ss-pill">
                <span className="icon">🚌</span>
                {bus.busName}
              </span>
              <span className="ss-pill">
                <span className="icon">📍</span>
                {fromCity} → {toCity}
              </span>
              <span className="ss-pill">
                <span className="icon">📅</span>
                {travelDate}
              </span>
            </div>
          </div>

          {/* Decks */}
          {renderDeck(1, upperDeckSeats, "Upper Deck", "U")}
          {renderDeck(16, lowerDeckSeats, "Lower Deck", "L")}

          {/* Legend */}
          <div className="ss-legend">
            <div className="ss-legend-item">
              <div className="ss-legend-dot" style={{ background: "#2d8a4e" }} />
              Available
            </div>
            <div className="ss-legend-item">
              <div className="ss-legend-dot" style={{ background: "#e8401c" }} />
              Selected
            </div>
            <div className="ss-legend-item">
              <div className="ss-legend-dot" style={{ background: "#e4e1d9" }} />
              Booked
            </div>
          </div>

          {/* Sticky footer */}
          <div className="ss-footer">
            <div className="ss-summary-bar">
              <div className="ss-summary-left">
                <span className="ss-summary-label">Selected Seats</span>
                <span className="ss-summary-seats">
                  {selectedSeats.length > 0 ? (
                    <>
                      <span className="ss-summary-count">{selectedSeats.length}</span>
                      {selectedSeats.join(", ")}
                    </>
                  ) : (
                    "None selected yet"
                  )}
                </span>
              </div>

              <button
                onClick={proceedToPayment}
                disabled={selectedSeats.length === 0}
                className="ss-pay-btn"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SeatSelection;
