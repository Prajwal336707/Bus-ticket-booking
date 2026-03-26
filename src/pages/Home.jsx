import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import axios from "axios";

const getTodayStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── KEYFRAMES ── */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 60px; }
  }
  @keyframes gridPulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.18; }
    50%       { opacity: 0.30; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes borderFlash {
    0%   { border-color: rgba(220,38,38,0.5); }
    50%  { border-color: rgba(245,158,11,0.7); }
    100% { border-color: rgba(220,38,38,0.5); }
  }
  @keyframes cardSlideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes priceCount {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatDot {
    0%, 100% { transform: translateY(0px); opacity: 0.6; }
    50%       { transform: translateY(-8px); opacity: 1; }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes routeArrow {
    0%, 100% { transform: scaleX(1); }
    50%       { transform: scaleX(1.06); }
  }
  @keyframes btnPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
    50%       { box-shadow: 0 0 0 8px rgba(220,38,38,0.15); }
  }

  .home-root {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ece4;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .home-main { flex: 1; }

  /* ── HERO ── */
  .hero {
    position: relative;
    width: 100%;
    padding: 90px 40px 100px;
    overflow: hidden;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a0a0f 100%);
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 50%, rgba(220,38,38,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 60% 80% at 80% 30%, rgba(234,179,8,0.10) 0%, transparent 70%);
    pointer-events: none;
    animation: glowPulse 4s ease-in-out infinite;
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridPulse 6s ease-in-out infinite;
  }
  .hero-content {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
  }
  .hero-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #dc2626;
    background: rgba(220,38,38,0.12);
    border: 1px solid rgba(220,38,38,0.3);
    padding: 6px 18px;
    border-radius: 2px;
    margin-bottom: 28px;
    animation: fadeInDown 0.7s ease both;
    animation-delay: 0.1s;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 7vw, 84px);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.02em;
    color: #f0ece4;
    margin-bottom: 20px;
    animation: fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.25s;
  }
  .hero-title span {
    color: #dc2626;
    display: inline-block;
    background: linear-gradient(90deg, #dc2626 0%, #f59e0b 50%, #dc2626 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3.5s linear infinite;
    animation-delay: 1s;
  }
  .hero-sub {
    font-size: 16px;
    font-weight: 300;
    color: rgba(240,236,228,0.55);
    letter-spacing: 0.04em;
    max-width: 440px;
    margin: 0 auto;
    animation: fadeIn 1s ease both;
    animation-delay: 0.5s;
  }
  .hero-line {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #dc2626, #f59e0b);
    margin: 30px auto 0;
    animation: lineGrow 0.8s ease both;
    animation-delay: 0.7s;
  }

  .hero-dot {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .hero-dot-1 {
    width: 6px; height: 6px;
    background: #dc2626;
    top: 20%; left: 10%;
    animation: floatDot 3.2s ease-in-out infinite;
    opacity: 0.5;
  }
  .hero-dot-2 {
    width: 4px; height: 4px;
    background: #f59e0b;
    top: 60%; right: 12%;
    animation: floatDot 4s ease-in-out infinite reverse;
    animation-delay: 1s;
    opacity: 0.4;
  }
  .hero-dot-3 {
    width: 8px; height: 8px;
    background: rgba(220,38,38,0.3);
    top: 30%; right: 20%;
    animation: floatDot 2.8s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  /* ── OFFERS ── */
  .offers-wrapper {
    max-width: 960px;
    margin: -40px auto 0;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    position: relative;
    z-index: 10;
  }
  @media (max-width: 680px) {
    .offers-wrapper { grid-template-columns: 1fr; margin-top: 32px; }
  }
  .offer-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    padding: 22px 20px;
    backdrop-filter: blur(12px);
    cursor: default;
    opacity: 0;
    animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }
  .offer-card:nth-child(1) { animation-delay: 0.55s; }
  .offer-card:nth-child(2) { animation-delay: 0.70s; }
  .offer-card:nth-child(3) { animation-delay: 0.85s; }
  .offer-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: rgba(220,38,38,0.4);
    background: rgba(220,38,38,0.07);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(220,38,38,0.1);
  }
  .offer-pill {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 2px;
    margin-bottom: 10px;
    transition: transform 0.2s;
  }
  .offer-card:hover .offer-pill { transform: scale(1.05); }
  .pill-yellow { background: rgba(234,179,8,0.15); color: #f59e0b; }
  .pill-green  { background: rgba(34,197,94,0.15);  color: #22c55e; }
  .pill-blue   { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .offer-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #f0ece4;
    transition: color 0.2s;
  }
  .offer-card:hover .offer-title { color: #fff; }
  .offer-desc {
    font-size: 13px;
    color: rgba(240,236,228,0.5);
    line-height: 1.5;
    font-weight: 300;
  }

  /* ── SEARCH FORM ── */
  .search-wrapper {
    max-width: 960px;
    margin: 48px auto;
    padding: 0 24px;
    animation: fadeInUp 0.7s ease both;
    animation-delay: 1s;
  }
  .search-label {
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.4);
    margin-bottom: 20px;
    font-weight: 500;
  }
  .search-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: 28px;
    backdrop-filter: blur(20px);
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .search-card:focus-within {
    border-color: rgba(220,38,38,0.3);
    box-shadow: 0 0 30px rgba(220,38,38,0.08);
  }
  .input-group {
    flex: 1;
    min-width: 180px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 14px 16px;
    transition: border-color 0.25s, background 0.25s, transform 0.2s, box-shadow 0.25s;
  }
  .input-group:focus-within {
    border-color: rgba(220,38,38,0.6);
    background: rgba(220,38,38,0.05);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(220,38,38,0.12);
  }
  .input-group svg {
    flex-shrink: 0;
    color: #dc2626;
    width: 16px; height: 16px;
    transition: transform 0.3s;
  }
  .input-group:focus-within svg { transform: scale(1.2) rotate(-10deg); }
  .input-group input {
    background: transparent;
    border: none;
    outline: none;
    color: #f0ece4;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    width: 100%;
  }
  .input-group input::placeholder { color: rgba(240,236,228,0.3); }
  .input-group input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.6);
    cursor: pointer;
  }

  .search-btn {
    background: #dc2626;
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    animation: btnPulse 2.5s ease-in-out infinite;
    animation-delay: 2s;
  }
  .search-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transform: translateX(-100%);
    transition: transform 0s;
  }
  .search-btn:hover::after {
    transform: translateX(100%);
    transition: transform 0.4s ease;
  }
  .search-btn:hover {
    background: #b91c1c;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(220,38,38,0.35);
    animation: none;
  }
  .search-btn:active { transform: translateY(0) scale(0.97); }

  /* ── BUS RESULTS ── */
  .results-wrapper {
    max-width: 960px;
    margin: 0 auto 80px;
    padding: 0 24px;
  }
  .results-label {
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.4);
    margin-bottom: 20px;
    font-weight: 500;
    animation: fadeIn 0.5s ease both;
  }
  .no-buses {
    text-align: center;
    color: rgba(240,236,228,0.3);
    font-size: 14px;
    padding: 60px 0;
    letter-spacing: 0.05em;
  }

  .bus-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 24px 28px;
    margin-bottom: 14px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: cardSlideIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
    transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .bus-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: transparent;
    transition: background 0.3s;
  }
  .bus-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  .bus-card:hover {
    border-color: rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.05);
    transform: translateX(4px);
    box-shadow: -4px 0 20px rgba(220,38,38,0.08), 0 4px 20px rgba(0,0,0,0.2);
  }
  .bus-card:hover::after { opacity: 1; }
  .bus-card.selected {
    border-color: rgba(220,38,38,0.5);
    background: rgba(220,38,38,0.06);
    animation: borderFlash 2s ease-in-out infinite, cardSlideIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
    box-shadow: 0 0 30px rgba(220,38,38,0.1);
  }
  .bus-card.selected::before {
    background: linear-gradient(180deg, #dc2626, #f59e0b);
  }

  .bus-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
  }
  .bus-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #f0ece4;
    transition: color 0.2s;
  }
  .bus-card:hover .bus-name { color: #fff; }
  .bus-price {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #f59e0b;
    animation: priceCount 0.4s ease both;
    transition: transform 0.2s;
  }
  .bus-card:hover .bus-price { transform: scale(1.05); }
  .bus-price span {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: rgba(240,236,228,0.35);
    letter-spacing: 0.1em;
  }

  .bus-route {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .route-city {
    font-size: 13px;
    font-weight: 500;
    color: rgba(240,236,228,0.7);
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .bus-card:hover .route-city { color: rgba(240,236,228,0.9); }
  .route-arrow {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(220,38,38,0.5), rgba(245,158,11,0.5));
    position: relative;
    max-width: 120px;
    transition: max-width 0.3s ease;
    animation: routeArrow 2s ease-in-out infinite;
  }
  .bus-card:hover .route-arrow { max-width: 160px; }
  .route-arrow::after {
    content: '›';
    position: absolute;
    right: -2px;
    top: -9px;
    color: #f59e0b;
    font-size: 14px;
    transition: transform 0.2s;
  }
  .bus-card:hover .route-arrow::after { transform: translateX(3px); }

  .bus-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    transition: transform 0.2s;
  }
  .bus-card:hover .meta-item { transform: translateY(-1px); }
  .meta-key {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.3);
    font-weight: 500;
  }
  .meta-val {
    font-size: 13px;
    font-weight: 400;
  }
  .val-green  { color: #4ade80; }
  .val-blue   { color: #60a5fa; }
  .val-muted  { color: rgba(240,236,228,0.6); }
  .val-seats  { color: #f59e0b; }

  .select-seats-btn {
    margin-top: 20px;
    background: transparent;
    color: #dc2626;
    border: 1px solid #dc2626;
    padding: 11px 28px;
    border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
    animation: fadeInUp 0.4s ease both;
    position: relative;
    overflow: hidden;
  }
  .select-seats-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #dc2626;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    z-index: -1;
  }
  .select-seats-btn:hover::before { transform: scaleX(1); }
  .select-seats-btn:hover {
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220,38,38,0.3);
  }
  .select-seats-btn:active { transform: translateY(0); }

  /* Loading spinner */
  .search-btn.loading {
    pointer-events: none;
    opacity: 0.8;
  }
  .search-btn.loading::before {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spinSlow 0.7s linear infinite;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
  }
  .search-btn.loading span { opacity: 0; }

  .section-divider {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.06);
    max-width: 960px;
    margin: 0 auto 48px;
  }

  /* ── FOOTER ── */
  .home-footer {
    background: #080810;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 48px 40px 28px;
  }
  .footer-inner {
    max-width: 960px;
    margin: 0 auto;
  }
  .footer-top {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }
  @media (max-width: 768px) {
    .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
  }
  @media (max-width: 480px) {
    .footer-top { grid-template-columns: 1fr; }
  }
  .footer-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    color: #f0ece4;
    letter-spacing: -0.01em;
    margin-bottom: 10px;
  }
  .footer-brand-name span { color: #dc2626; }
  .footer-brand-desc {
    font-size: 13px;
    color: rgba(240,236,228,0.35);
    line-height: 1.6;
    font-weight: 300;
    max-width: 220px;
  }
  .footer-brand-line {
    width: 36px;
    height: 2px;
    background: linear-gradient(90deg, #dc2626, #f59e0b);
    margin-top: 16px;
  }
  .footer-col-title {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(220,38,38,0.65);
    margin-bottom: 16px;
  }
  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .footer-link {
    font-size: 13px;
    color: rgba(240,236,228,0.4);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
    width: fit-content;
    font-weight: 300;
  }
  .footer-link:hover { color: #f0ece4; transform: translateX(4px); }
  .footer-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin-bottom: 24px;
  }
  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .footer-copy {
    font-size: 11px;
    color: rgba(240,236,228,0.2);
    letter-spacing: 0.06em;
  }
  .footer-copy span { color: #dc2626; }
  .footer-badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .footer-badge {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.22);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 2px;
    padding: 4px 10px;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const [fromCity, setFromCity]     = useState("");
  const [toCity, setToCity]         = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [buses, setBuses]           = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [loading, setLoading]       = useState(false);

  const searchBuses = async () => {
    try {
      if (!fromCity || !toCity) {
        alert("Please enter both From and To cities");
        return;
      }
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/buses?from=${fromCity}&to=${toCity}`
      );
      setBuses(res.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching buses");
    } finally {
      setLoading(false);
    }
  };

  const proceedToSeatSelection = (bus) => {
    navigate("/select-seats", { state: { fromCity, toCity, travelDate, bus } });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home-root">
        <div className="home-main">

          {/* Hero Section */}
          <div className="hero">
            <div className="hero-grid" />
            <div className="hero-dot hero-dot-1" />
            <div className="hero-dot hero-dot-2" />
            <div className="hero-dot hero-dot-3" />
            <div className="hero-content">
              <div className="hero-eyebrow">Premium Bus Travel</div>
              <h1 className="hero-title">
                Find Your Next<br /><span>Destination</span>
              </h1>
              <p className="hero-sub">Travel safely and comfortably with our curated fleet</p>
              <div className="hero-line" />
            </div>
          </div>

          {/* Offers Section */}
          <div className="offers-wrapper">
            <div className="offer-card">
              <div className="offer-pill pill-yellow">Limited</div>
              <h3 className="offer-title">Summer Sale</h3>
              <p className="offer-desc">Get up to 20% off on select routes!</p>
            </div>
            <div className="offer-card">
              <div className="offer-pill pill-green">Early Bird</div>
              <h3 className="offer-title">Advance Booking</h3>
              <p className="offer-desc">Book 7 days in advance and save ₹150</p>
            </div>
            <div className="offer-card">
              <div className="offer-pill pill-blue">Weekend</div>
              <h3 className="offer-title">Weekend Special</h3>
              <p className="offer-desc">Flat 10% discount on weekend travel</p>
            </div>
          </div>

          {/* Search Form */}
          <div className="search-wrapper">
            <p className="search-label">Search Routes</p>
            <div className="search-card">
              <div className="input-group">
                <MapPin />
                <input
                  type="text"
                  placeholder="From City"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                />
              </div>
              <div className="input-group">
                <MapPin />
                <input
                  type="text"
                  placeholder="To City"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                />
              </div>
              <div className="input-group">
                <Calendar />
                <input
                  type="date"
                  value={travelDate}
                  min={getTodayStr()}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>
              <button
                className={`search-btn${loading ? " loading" : ""}`}
                onClick={searchBuses}
              >
                <span>Search Buses</span>
              </button>
            </div>
          </div>

          {/* Bus Results */}
          <div className="results-wrapper">
            {buses.length > 0 && (
              <p className="results-label">Available Buses — {buses.length} found</p>
            )}
            {buses.length === 0 && (
              <p className="no-buses">No buses found. Enter a route above to search.</p>
            )}
            {buses.map((bus, i) => (
              <div
                key={bus._id}
                className={`bus-card ${selectedBusId === bus._id ? "selected" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => setSelectedBusId(bus._id)}
              >
                <div className="bus-header">
                  <h3 className="bus-name">{bus.busName}</h3>
                  <div className="bus-price">₹{bus.price} <span>/ seat</span></div>
                </div>
                <div className="bus-route">
                  <span className="route-city">{bus.from}</span>
                  <div className="route-arrow" />
                  <span className="route-city">{bus.to}</span>
                </div>
                <div className="bus-meta">
                  <div className="meta-item">
                    <span className="meta-key">Departure</span>
                    <span className="meta-val val-green">{bus.departureTime}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">Arrival</span>
                    <span className="meta-val val-blue">{bus.arrivalTime}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">Type</span>
                    <span className="meta-val val-muted">{bus.busType}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">Seats Available</span>
                    <span className="meta-val val-seats">{bus.availableSeats}</span>
                  </div>
                </div>
                {selectedBusId === bus._id && (
                  <button
                    className="select-seats-btn"
                    onClick={() => proceedToSeatSelection(bus)}
                  >
                    Select Seats →
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* ── FOOTER ── */}
        <footer className="home-footer">
          <div className="footer-inner">
            <div className="footer-top">

              {/* Brand */}
              <div>
                <div className="footer-brand-name">Bus<span>Book</span></div>
                <p className="footer-brand-desc">
                  Your trusted partner for safe, comfortable, and affordable bus travel across India.
                </p>
                <div className="footer-brand-line" />
              </div>

              {/* Quick Links */}
              <div>
                <div className="footer-col-title">Quick Links</div>
                <div className="footer-links">
                  <span className="footer-link">Home</span>
                  <span className="footer-link">Search Buses</span>
                  <span className="footer-link">My Bookings</span>
                  <span className="footer-link">Contact Us</span>
                </div>
              </div>

              {/* Support */}
              <div>
                <div className="footer-col-title">Support</div>
                <div className="footer-links">
                  <span className="footer-link">Help Center</span>
                  <span className="footer-link">Cancellation Policy</span>
                  <span className="footer-link">Refund Policy</span>
                  <span className="footer-link">Privacy Policy</span>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="footer-col-title">Contact</div>
                <div className="footer-links">
                  <span className="footer-link">support@busbook.in</span>
                  <span className="footer-link">+91 98765 43210</span>
                  <span className="footer-link">Mon – Sat, 9am – 6pm</span>
                </div>
              </div>

            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
              <div className="footer-copy">
                © {new Date().getFullYear()} <span>BusBook</span>. All rights reserved.
              </div>
              <div className="footer-badges">
                <span className="footer-badge">🔒 Secure Payments</span>
                <span className="footer-badge">✅ Verified Operators</span>
                <span className="footer-badge">📱 24/7 Support</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Home;
