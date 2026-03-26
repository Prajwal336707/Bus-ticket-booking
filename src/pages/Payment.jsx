import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

/* ─── Google Fonts injection ─── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

/* ─── Styles ─── */
const styles = `
  :root {
    --red:       #e8183b;
    --red-deep:  #b50f2a;
    --red-light: #ff4d6a;
    --bg:        #0a0609;
    --card:      #130b10;
    --card2:     #1a0f15;
    --border:    rgba(232,24,59,0.18);
    --text:      #f5eaed;
    --muted:     #9a7d85;
    --green:     #22c55e;
    --error:     #ff4d6a;
  }

  .pay-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    overflow-x: hidden;
    position: relative;
  }

  /* noise */
  .pay-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: .6;
  }

  /* blobs */
  .pay-blob {
    position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
  }
  .pay-blob-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(232,24,59,.22), transparent 70%);
    top: -120px; left: -100px;
  }
  .pay-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(232,24,59,.12), transparent 70%);
    bottom: -80px; right: -60px;
  }

  /* page */
  .pay-page {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    padding: 96px 24px 60px;
  }

  /* header */
  .pay-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 42px; width: 100%; max-width: 900px;
  }
  .pay-logo {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, var(--red-light), var(--red-deep));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 18px rgba(232,24,59,.45);
    flex-shrink: 0;
  }
  .pay-brand {
    font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--text);
  }
  .pay-step {
    margin-left: auto;
    font-size: .75rem; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; color: var(--muted);
    border: 1px solid var(--border); border-radius: 20px; padding: 5px 14px;
    white-space: nowrap;
  }

  /* grid */
  .pay-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    width: 100%; max-width: 900px;
  }
  @media (max-width: 720px) {
    .pay-grid { grid-template-columns: 1fr; }
  }

  /* cards */
  .pay-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 36px;
    position: relative;
    overflow: hidden;
    animation: paySlideUp .55s cubic-bezier(.23,1,.32,1) both;
  }
  .pay-card-summary {
    background: var(--card2);
    animation-delay: .1s;
  }
  .pay-card::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(232,24,59,.04), transparent 60%);
    pointer-events: none;
  }
  .pay-card-accent {
    position: absolute; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,24,59,.25), transparent 70%);
    filter: blur(40px); pointer-events: none;
  }

  /* section labels */
  .pay-slabel {
    font-family: 'Syne', sans-serif;
    font-size: .7rem; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    color: var(--red); margin-bottom: 6px;
  }
  .pay-stitle {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem; font-weight: 800;
    color: var(--text); margin-bottom: 28px; line-height: 1.1;
  }

  /* card visual preview */
  .pay-cardvisual {
    background: linear-gradient(135deg, #2a0d16, #1e0b12);
    border: 1px solid rgba(232,24,59,.2);
    border-radius: 16px;
    padding: 18px 22px;
    margin-bottom: 28px;
    position: relative; overflow: hidden;
  }
  .pay-cardvisual::before {
    content: '';
    position: absolute; top: -30px; right: -30px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(232,24,59,.3), transparent 70%);
    border-radius: 50%;
  }
  .pay-chip {
    width: 34px; height: 26px;
    background: linear-gradient(135deg, #d4a843, #a07820);
    border-radius: 5px; margin-bottom: 14px;
  }
  .pay-cardnum {
    font-family: 'Syne', sans-serif;
    font-size: .95rem; font-weight: 600; letter-spacing: .2em;
    color: rgba(245,234,237,.55); margin-bottom: 14px;
    transition: color .2s;
  }
  .pay-cardnum.active { color: rgba(245,234,237,.9); }
  .pay-cardrow { display: flex; justify-content: space-between; align-items: center; }
  .pay-cardlabel { font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .pay-cardval { font-family: 'Syne', sans-serif; font-size: .8rem; color: var(--text); margin-top: 2px; }

  /* inputs */
  .pay-field { margin-bottom: 14px; }
  .pay-field label {
    display: block; font-size: .7rem; font-weight: 500;
    letter-spacing: .09em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 6px;
  }
  .pay-input {
    width: 100%; padding: 13px 16px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(232,24,59,.15);
    border-radius: 12px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: .9rem;
    outline: none; transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .pay-input::placeholder { color: rgba(154,125,133,.5); }
  .pay-input:focus {
    border-color: rgba(232,24,59,.6);
    box-shadow: 0 0 0 3px rgba(232,24,59,.1);
  }
  .pay-input.pay-input-error {
    border-color: rgba(255,77,106,.7);
    box-shadow: 0 0 0 3px rgba(255,77,106,.12);
    animation: payShake .35s cubic-bezier(.36,.07,.19,.97);
  }
  .pay-input-pin { padding-right: 42px; letter-spacing: .25em; }
  .pay-row-fields { display: flex; gap: 12px; }
  .pay-row-fields .pay-field { flex: 1; }
  .pay-pin-wrap { position: relative; }
  .pay-pin-icon {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    color: var(--muted); display: flex; align-items: center;
  }

  /* error message */
  .pay-error-msg {
    display: flex; align-items: center; gap: 5px;
    margin-top: 5px;
    font-size: .68rem; font-weight: 500;
    color: var(--error);
    letter-spacing: .03em;
    animation: payFadeIn .2s ease both;
  }
  .pay-error-msg svg { flex-shrink: 0; }

  /* pay button */
  .pay-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, var(--red-light), var(--red-deep));
    border: none; border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 1rem; font-weight: 700;
    color: #fff; letter-spacing: .04em;
    cursor: pointer; margin-top: 6px;
    position: relative; overflow: hidden;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 0 6px 28px rgba(232,24,59,.35);
  }
  .pay-btn::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    animation: payShimmer 2.2s ease-in-out infinite;
  }
  .pay-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 36px rgba(232,24,59,.5); }
  .pay-btn:active:not(:disabled) { transform: translateY(0); }
  .pay-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* ── No-Refund Notice ── */
  .pay-norefund {
    display: flex; align-items: flex-start; gap: 10px;
    margin-top: 14px;
    background: rgba(232,24,59,.07);
    border: 1px solid rgba(232,24,59,.28);
    border-radius: 10px;
    padding: 11px 14px;
  }
  .pay-norefund-icon {
    flex-shrink: 0; margin-top: 1px;
    color: var(--red-light);
  }
  .pay-norefund-text {
    font-size: .72rem; line-height: 1.55;
    color: rgba(245,234,237,.65);
  }
  .pay-norefund-text strong {
    display: block; font-weight: 700;
    color: var(--red-light); margin-bottom: 2px;
    font-size: .73rem; text-transform: uppercase; letter-spacing: .06em;
  }

  /* security strip */
  .pay-security {
    display: flex; align-items: center; gap: 16px;
    margin-top: 28px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.05);
    flex-wrap: wrap;
  }
  .pay-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: .65rem; letter-spacing: .07em; text-transform: uppercase;
    color: var(--muted);
  }

  /* route pill */
  .pay-routepill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,24,59,.08);
    border: 1px solid rgba(232,24,59,.2);
    border-radius: 30px; padding: 7px 16px;
    font-size: .82rem; font-weight: 500; margin-bottom: 24px;
  }
  .pay-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--red); box-shadow: 0 0 6px var(--red);
    flex-shrink: 0;
  }

  /* info rows */
  .pay-inforow {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    padding: 13px 0;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .pay-infokey {
    font-size: .75rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: .07em;
    color: var(--muted);
  }
  .pay-infoval {
    font-family: 'Syne', sans-serif;
    font-size: .9rem; font-weight: 600;
    color: var(--text); text-align: right;
  }

  /* seat badges */
  .pay-seatstag { display: inline-flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .pay-seatbadge {
    background: rgba(232,24,59,.12);
    border: 1px solid rgba(232,24,59,.25);
    border-radius: 6px; padding: 3px 9px;
    font-size: .78rem; font-weight: 600;
    color: var(--red-light);
  }

  /* divider */
  .pay-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,24,59,.3), transparent);
    margin: 20px 0;
  }

  /* total */
  .pay-totalrow { display: flex; align-items: center; justify-content: space-between; }
  .pay-totallabel {
    font-family: 'Syne', sans-serif; font-size: .95rem; font-weight: 700; color: var(--text);
  }
  .pay-totalamt {
    font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800;
    color: var(--green); text-shadow: 0 0 20px rgba(34,197,94,.3);
  }

  /* success overlay */
  .pay-success-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,.75);
    backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .pay-success-box {
    background: var(--card);
    border: 1px solid rgba(34,197,94,.25);
    border-radius: 24px; padding: 48px 56px;
    display: flex; flex-direction: column; align-items: center;
    gap: 16px;
    box-shadow: 0 0 60px rgba(34,197,94,.15);
    animation: paySlideUp .5s cubic-bezier(.23,1,.32,1) both;
  }
  .pay-check-circle {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(34,197,94,.1);
    border: 2px solid rgba(34,197,94,.4);
    display: flex; align-items: center; justify-content: center;
    animation: payBounce 1s infinite;
  }
  .pay-success-title {
    font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--green);
  }
  .pay-success-sub { font-size: .88rem; color: var(--muted); }

  /* empty state */
  .pay-empty {
    min-height: 100vh; background: var(--bg);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; color: var(--text); gap: 16px;
  }
  .pay-empty h2 {
    font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800;
  }
  .pay-empty p { color: var(--muted); }
  .pay-back-btn {
    margin-top: 8px; padding: 12px 28px;
    background: linear-gradient(135deg, var(--red-light), var(--red-deep));
    border: none; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-size: .9rem; font-weight: 700;
    color: #fff; cursor: pointer; letter-spacing: .04em;
    box-shadow: 0 4px 20px rgba(232,24,59,.3);
    transition: transform .15s;
  }
  .pay-back-btn:hover { transform: translateY(-1px); }

  /* payment method tabs */
  .pay-tabs {
    display: flex; gap: 8px;
    margin-bottom: 24px;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(232,24,59,.12);
    border-radius: 14px;
    padding: 5px;
  }
  .pay-tab {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 10px 14px;
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: .78rem; font-weight: 700; letter-spacing: .04em;
    cursor: pointer;
    transition: background .2s, color .2s, box-shadow .2s;
    background: transparent; color: var(--muted);
  }
  .pay-tab.active {
    background: linear-gradient(135deg, var(--red-light), var(--red-deep));
    color: #fff;
    box-shadow: 0 4px 16px rgba(232,24,59,.35);
  }
  .pay-tab:not(.active):hover { background: rgba(232,24,59,.08); color: var(--text); }

  /* UPI scan section */
  .pay-upi-wrap {
    display: flex; flex-direction: column; align-items: center;
    gap: 16px; padding: 8px 0 4px;
    animation: payFadeIn .25s ease both;
  }
  .pay-upi-apps {
    display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
  }
  .pay-upi-app {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    font-size: .6rem; letter-spacing: .05em; color: var(--muted);
    text-transform: uppercase;
  }
  .pay-upi-app-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    border: 1px solid rgba(255,255,255,.07);
  }
  .pay-upi-qr-box {
    background: #fff;
    border-radius: 18px;
    padding: 14px;
    box-shadow: 0 0 40px rgba(232,24,59,.22), 0 0 0 1px rgba(232,24,59,.15);
    position: relative;
  }
  .pay-upi-qr-box::before {
    content: '';
    position: absolute; inset: -3px;
    border-radius: 21px;
    background: linear-gradient(135deg, rgba(232,24,59,.4), transparent, rgba(232,24,59,.2));
    z-index: -1;
  }
  .pay-upi-scan-hint {
    display: flex; align-items: center; gap: 6px;
    background: rgba(34,197,94,.07);
    border: 1px solid rgba(34,197,94,.2);
    border-radius: 30px; padding: 6px 14px;
    font-size: .7rem; font-weight: 500; color: var(--green);
    animation: payScanPulse 2s ease-in-out infinite;
  }
  .pay-upi-scan-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    flex-shrink: 0;
  }
  .pay-upi-id {
    font-family: 'Syne', sans-serif;
    font-size: .78rem; font-weight: 600;
    color: var(--muted); letter-spacing: .06em;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 8px; padding: 7px 16px;
    text-align: center;
  }
  .pay-upi-id span { color: var(--text); }
  .pay-upi-timer {
    font-size: .68rem; color: var(--muted); text-align: center; line-height: 1.5;
  }
  .pay-upi-or {
    display: flex; align-items: center; gap: 10px;
    width: 100%; margin: 4px 0;
    color: var(--muted); font-size: .7rem; letter-spacing: .08em;
    text-transform: uppercase;
  }
  .pay-upi-or::before, .pay-upi-or::after {
    content: ''; flex: 1; height: 1px;
    background: rgba(255,255,255,.07);
  }
  .pay-upi-confirm-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    border: none; border-radius: 14px;
    font-family: 'Syne', sans-serif; font-size: .95rem; font-weight: 700;
    color: #fff; letter-spacing: .04em; cursor: pointer;
    box-shadow: 0 6px 24px rgba(34,197,94,.3);
    transition: transform .15s, box-shadow .15s;
    position: relative; overflow: hidden;
  }
  .pay-upi-confirm-btn::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    animation: payShimmer 2.2s ease-in-out infinite;
  }
  .pay-upi-confirm-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(34,197,94,.4); }
  .pay-upi-confirm-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  @keyframes payScanPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,.3); }
    50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
  }

  /* QR code */
  .pay-qr-wrap {
    display: flex; flex-direction: column; align-items: center;
    margin-top: 24px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.05);
    gap: 10px;
  }
  .pay-qr-label {
    font-size: .65rem; letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted);
  }
  .pay-qr-box {
    background: #fff;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 0 24px rgba(232,24,59,.18);
    display: flex; align-items: center; justify-content: center;
  }
  .pay-qr-sub {
    font-size: .62rem; color: var(--muted); letter-spacing: .04em;
    text-align: center;
  }

  /* keyframes */
  @keyframes paySlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes payShimmer {
    0%   { left: -100%; }
    60%  { left: 130%; }
    100% { left: 130%; }
  }
  @keyframes payBounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes payShake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  @keyframes payFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* ─── Error Icon ─── */
const ErrIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ─── Field Error ─── */
const FieldError = ({ msg }) =>
  msg ? (
    <div className="pay-error-msg">
      <ErrIcon />
      {msg}
    </div>
  ) : null;

/* ─── QR Code ─── */
const QRCode = ({ value, size = 120 }) => {
  const encoded = encodeURIComponent(value);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=0a0609&margin=0&format=svg`;
  return (
    <img src={src} alt="Booking QR" width={size} height={size}
      style={{ display: "block", borderRadius: 4 }} />
  );
};

/* ══════════════════════════════════════════
   PAYMENT COMPONENT
══════════════════════════════════════════ */
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bus, selected, fromCity, toCity, travelDate } = location.state || {};

  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "", pin: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── Empty state ── */
  if (!bus || !selected || selected.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="pay-empty">
          <h2>No Seats Selected</h2>
          <p>Please select your seats first.</p>
          <button className="pay-back-btn" onClick={() => navigate("/select-seats")}>
            Back to Seat Selection
          </button>
        </div>
      </>
    );
  }

  const totalAmount = bus.price * selected.length;

  const saveBooking = async () => {
    const token = localStorage.getItem("token");

    // 1. Save to MongoDB
    await axios.post(
      "http://localhost:5000/api/bookings",
      {
        busName:       bus.busName,
        busType:       bus.busType       || bus.type       || null, 
        fromCity,
        toCity,
        travelDate,
        departureTime: bus.departureTime || bus.departure  || bus.depTime || null, 
        arrivalTime:   bus.arrivalTime   || bus.arrival    || bus.arrTime || null, 
        duration:      bus.duration      || bus.travelTime || null,               
        seats:         selected,
        totalAmount,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 2. Also save to localStorage (for Bookings.jsx display)
    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    existingBookings.push({
      busName: bus.busName,
      fromCity,
      toCity,
      travelDate,
      seats: selected,
      totalAmount,
      payMethod,
    });
    localStorage.setItem("bookings", JSON.stringify(existingBookings));
  };

  /* ── Helpers ── */
  const handleChange = (field) => (e) => {
    let val = e.target.value;
    if (field === "cardNumber") {
      val = val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1  ").trim();
    }
    if (field === "expiry") {
      val = val.replace(/\D/g, "").slice(0, 4);
      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    }
    if (field === "cvv")  val = val.replace(/\D/g, "").slice(0, 4);
    if (field === "pin")  val = val.replace(/\D/g, "").slice(0, 4);

    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /* ── Validation ── */
  const validate = () => {
    const newErrors = {};
    const rawCard = form.cardNumber.replace(/\s/g, "");

    if (!rawCard)                  newErrors.cardNumber = "Card number is required";
    else if (rawCard.length < 16)  newErrors.cardNumber = "Enter a valid 16-digit card number";

    if (!form.expiry)              newErrors.expiry = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) newErrors.expiry = "Use MM/YY format";

    if (!form.cvv)                 newErrors.cvv = "CVV is required";
    else if (form.cvv.length < 3)  newErrors.cvv = "Enter a valid CVV";

    if (!form.pin)                 newErrors.pin = "Security PIN is required";
    else if (form.pin !== "1234")  newErrors.pin = "Invalid PIN. Please try again";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Card Payment handler ── */
  const handlePayment = async () => {
    if (!validate()) return;

    const confirmPayment = window.confirm(
      `Are you sure you want to pay ₹${totalAmount} for seats: ${selected.join(", ")}?`
    );
    if (!confirmPayment) return;

    setLoading(true);
    try {
      await saveBooking();
      setSuccess(true);
      setTimeout(() => { setSuccess(false); navigate("/home"); }, 2500);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed! Please check your connection or login again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── UPI Payment handler ── */
  const handleUpiPayment = async () => {
    const confirmPayment = window.confirm(
      `Confirm UPI payment of ₹${totalAmount} for seats: ${selected.join(", ")}?`
    );
    if (!confirmPayment) return;

    setLoading(true);
    try {
      await saveBooking();
      setSuccess(true);
      setTimeout(() => { setSuccess(false); navigate("/home"); }, 2500);
    } catch (err) {
      console.error("UPI Booking failed:", err);
      alert("Booking failed! Please check your connection or login again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <>
      <style>{styles}</style>

      <div className="pay-root">
        <div className="pay-blob pay-blob-1" />
        <div className="pay-blob pay-blob-2" />

        {/* ── Success Overlay ── */}
        {success && (
          <div className="pay-success-overlay">
            <div className="pay-success-box">
              <div className="pay-check-circle">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="pay-success-title">Payment Successful!</div>
              <div className="pay-success-sub">Your seats have been booked.</div>
            </div>
          </div>
        )}

        <div className="pay-page">

          {/* ── Header ── */}
          <div className="pay-header">
            <div className="pay-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 16V6a2 2 0 012-2h12a2 2 0 012 2v10" />
                <path d="M4 16l-1 3h18l-1-3M4 16h16" />
                <path d="M8 6v4M16 6v4M7 19v1M17 19v1" />
              </svg>
            </div>
            <span className="pay-brand">BusBook</span>
            <span className="pay-step">Step 3 of 3 — Payment</span>
          </div>

          {/* ── Main Grid ── */}
          <div className="pay-grid">

            {/* LEFT — Payment Form */}
            <div className="pay-card">
              <div className="pay-card-accent" style={{ width: 260, height: 260, top: -80, right: -80 }} />

              <div className="pay-slabel">Checkout</div>
              <div className="pay-stitle">Secure<br />Payment</div>

              {/* ── Payment Method Tabs ── */}
              <div className="pay-tabs">
                <button className={`pay-tab${payMethod === "card" ? " active" : ""}`} onClick={() => setPayMethod("card")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="1" y="4" width="22" height="16" rx="3" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Card
                </button>
                <button className={`pay-tab${payMethod === "upi" ? " active" : ""}`} onClick={() => setPayMethod("upi")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h3v3M14 17h3v3M17 14h3" />
                  </svg>
                  Scan &amp; Pay
                </button>
              </div>

              {/* ── CARD FORM ── */}
              {payMethod === "card" && (
                <>
                  <div className="pay-cardvisual">
                    <div className="pay-chip" />
                    <div className={`pay-cardnum ${form.cardNumber ? "active" : ""}`}>
                      {form.cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="pay-cardrow">
                      <div>
                        <div className="pay-cardlabel">Card Holder</div>
                        <div className="pay-cardval">Your Name</div>
                      </div>
                      <div>
                        <div className="pay-cardlabel">Expires</div>
                        <div className="pay-cardval">{form.expiry || "MM/YY"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pay-field">
                    <label>Card Number <span style={{ color: "var(--red)" }}>*</span></label>
                    <input className={`pay-input${errors.cardNumber ? " pay-input-error" : ""}`}
                      type="text" placeholder="1234  5678  9012  3456"
                      value={form.cardNumber} onChange={handleChange("cardNumber")} />
                    <FieldError msg={errors.cardNumber} />
                  </div>

                  <div className="pay-row-fields">
                    <div className="pay-field">
                      <label>Expiry <span style={{ color: "var(--red)" }}>*</span></label>
                      <input className={`pay-input${errors.expiry ? " pay-input-error" : ""}`}
                        type="text" placeholder="MM / YY"
                        value={form.expiry} onChange={handleChange("expiry")} />
                      <FieldError msg={errors.expiry} />
                    </div>
                    <div className="pay-field">
                      <label>CVV <span style={{ color: "var(--red)" }}>*</span></label>
                      <input className={`pay-input${errors.cvv ? " pay-input-error" : ""}`}
                        type="password" placeholder="•••"
                        value={form.cvv} onChange={handleChange("cvv")} />
                      <FieldError msg={errors.cvv} />
                    </div>
                  </div>

                  <div className="pay-field">
                    <label>Security PIN <span style={{ color: "var(--red)" }}>*</span></label>
                    <div className="pay-pin-wrap">
                      <input className={`pay-input pay-input-pin${errors.pin ? " pay-input-error" : ""}`}
                        type="password" placeholder="Enter PIN (1234)"
                        value={form.pin} onChange={handleChange("pin")} />
                      <span className="pay-pin-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      </span>
                    </div>
                    <FieldError msg={errors.pin} />
                  </div>

                  <button className="pay-btn" onClick={handlePayment}
                    disabled={selected.length === 0 || loading}>
                    {loading ? "Processing…" : `Pay Now — ₹${totalAmount}`}
                  </button>
                </>
              )}

              {/* ── UPI / SCAN & PAY ── */}
              {payMethod === "upi" && (
                <div className="pay-upi-wrap">
                  <div className="pay-upi-scan-hint">
                    <span className="pay-upi-scan-dot" />
                    Ready to Scan
                  </div>

                  <div className="pay-upi-apps">
                    {[
                      { icon: "📱", name: "GPay" },
                      { icon: "💜", name: "PhonePe" },
                      { icon: "🔵", name: "Paytm" },
                      { icon: "🟠", name: "BHIM" },
                      { icon: "🏦", name: "Any UPI" },
                    ].map((app) => (
                      <div key={app.name} className="pay-upi-app">
                        <div className="pay-upi-app-icon" style={{ background: "rgba(255,255,255,.04)" }}>
                          {app.icon}
                        </div>
                        {app.name}
                      </div>
                    ))}
                  </div>

                  <div className="pay-upi-qr-box">
                    <QRCode
                      value={`upi://pay?pa=busbook@upi&pn=BusBook&am=${totalAmount}&cu=INR&tn=BusTicket-${selected.join("")}-${travelDate}`}
                      size={160}
                    />
                  </div>

                  <div className="pay-upi-id">UPI ID: <span>busbook@upi</span></div>

                  <div className="pay-upi-timer">
                    Open any UPI app → Scan QR → Pay <strong style={{ color: "var(--green)" }}>₹{totalAmount}</strong>
                    <br />QR is valid for this session only
                  </div>

                  <div className="pay-upi-or">or</div>

                  <button className="pay-upi-confirm-btn" onClick={handleUpiPayment} disabled={loading}>
                    {loading ? "Confirming…" : "✓  I've Completed the Payment"}
                  </button>
                </div>
              )}

              {/* ── No-Refund Notice ── */}
              <div className="pay-norefund" style={{ marginTop: 16 }}>
                <span className="pay-norefund-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </span>
                <div className="pay-norefund-text">
                  <strong>No Refund Policy</strong>
                  Ticket cancellations are non-refundable. Once your booking is confirmed, no refunds will be issued under any circumstances.
                </div>
              </div>

              {/* Security Strip */}
              <div className="pay-security">
                <span className="pay-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  SSL Encrypted
                </span>
                <span className="pay-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                  Instant Confirm
                </span>
                <span className="pay-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  PCI Compliant
                </span>
              </div>
            </div>

            {/* RIGHT — Booking Summary */}
            <div className="pay-card pay-card-summary">
              <div className="pay-card-accent" style={{ width: 220, height: 220, bottom: -60, left: -60 }} />

              <div className="pay-slabel">Overview</div>
              <div className="pay-stitle">Booking<br />Summary</div>

              <div className="pay-routepill">
                <span className="pay-dot" />
                {fromCity}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                {toCity}
              </div>

              <div className="pay-inforow">
                <span className="pay-infokey">Bus</span>
                <span className="pay-infoval">{bus.busName}</span>
              </div>
              <div className="pay-inforow">
                <span className="pay-infokey">Date</span>
                <span className="pay-infoval">{travelDate}</span>
              </div>
              <div className="pay-inforow">
                <span className="pay-infokey">Seats</span>
                <span className="pay-infoval">
                  <div className="pay-seatstag">
                    {selected.map((seat) => (
                      <span key={seat} className="pay-seatbadge">{seat}</span>
                    ))}
                  </div>
                </span>
              </div>
              <div className="pay-inforow">
                <span className="pay-infokey">Price / Seat</span>
                <span className="pay-infoval">₹{bus.price}</span>
              </div>

              <div className="pay-divider" />

              <div className="pay-totalrow">
                <div>
                  <div className="pay-infokey" style={{ marginBottom: 4 }}>Total Payable</div>
                  <div className="pay-totallabel">{selected.length} Seat{selected.length > 1 ? "s" : ""}</div>
                </div>
                <div className="pay-totalamt">₹{totalAmount}</div>
              </div>

              <div className="pay-qr-wrap">
                <div className="pay-qr-label">Booking Reference QR</div>
                <div className="pay-qr-box">
                  <QRCode
                    value={`BUSBOOK|${bus.busName}|${fromCity}-${toCity}|${travelDate}|SEATS:${selected.join(",")}|AMT:${totalAmount}`}
                    size={118}
                  />
                </div>
                <div className="pay-qr-sub">Scan at the bus counter to verify your ticket</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
