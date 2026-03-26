import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Nunito:wght@500;700&display=swap');

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeInLeft {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeInRight {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes busRide {
          0%   { transform: translateX(0px) rotate(0deg); }
          25%  { transform: translateX(3px) rotate(1deg); }
          50%  { transform: translateX(0px) rotate(0deg); }
          75%  { transform: translateX(-3px) rotate(-1deg); }
          100% { transform: translateX(0px) rotate(0deg); }
        }

        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(250,204,21,0.4)); }
          50%       { filter: drop-shadow(0 0 18px rgba(249,115,22,0.9)); }
        }

        @keyframes letterPop {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        .navbar {
          animation: slideDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .brand-logo {
          animation: fadeInLeft 0.7s ease 0.3s both, busRide 3s ease-in-out 1.2s infinite;
        }

        .brand-logo:hover {
          animation: busRide 0.4s ease-in-out infinite;
        }

        .brand-title {
          font-family: 'Righteous', cursive;
          font-size: 1.65rem;
          letter-spacing: 0.1em;
          background: linear-gradient(270deg, #FACC15, #F97316, #FBBF24, #EF4444, #FACC15);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fadeInLeft 0.7s ease 0.4s both, gradientShift 4s ease infinite 1.2s, glowPulse 3s ease-in-out 1.5s infinite;
        }

        .brand-title span {
          display: inline-block;
          transition: transform 0.2s ease;
        }

        .brand-title span:hover {
          animation: letterPop 0.4s ease forwards;
        }

        .nav-buttons {
          animation: fadeInRight 0.7s ease 0.5s both;
        }

        .nav-btn {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
        }

        .nav-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 2px;
          background: #FACC15;
          transition: width 0.3s ease, left 0.3s ease;
          border-radius: 2px;
        }

        .nav-btn:hover::after {
          width: 100%;
          left: 0;
        }

        .nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(250,204,21,0.25);
          color: #FACC15 !important;
        }

        .nav-btn:active {
          transform: translateY(0px) scale(0.97);
        }

        .logout-btn {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #EF4444, #DC2626);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }

        .logout-btn:hover::before {
          opacity: 1;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239,68,68,0.4);
          color: white !important;
        }

        .logout-btn span {
          position: relative;
          z-index: 1;
        }

        .logout-btn:active {
          transform: scale(0.96);
        }
      `}</style>

      <div className="navbar w-full h-14 px-8 flex justify-between items-center shadow-lg fixed top-0 left-0 z-50 bg-gray-900 border-b border-yellow-500/20">

        {/* Logo + Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <svg
            className="brand-logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="38"
            height="38"
            fill="none"
          >
            <rect x="4" y="14" width="56" height="30" rx="6" fill="#FACC15" />
            <rect x="8" y="10" width="48" height="8" rx="4" fill="#EAB308" />
            <rect x="10" y="18" width="10" height="8" rx="2" fill="#BAE6FD" />
            <rect x="24" y="18" width="10" height="8" rx="2" fill="#BAE6FD" />
            <rect x="38" y="18" width="10" height="8" rx="2" fill="#BAE6FD" />
            <rect x="46" y="26" width="8" height="12" rx="2" fill="#CA8A04" />
            <rect x="4" y="32" width="56" height="4" fill="#EAB308" opacity="0.5" />
            <circle cx="16" cy="46" r="7" fill="#1F2937" />
            <circle cx="16" cy="46" r="3" fill="#6B7280" />
            <circle cx="48" cy="46" r="7" fill="#1F2937" />
            <circle cx="48" cy="46" r="3" fill="#6B7280" />
            <rect x="5" y="24" width="5" height="4" rx="1" fill="#FEF08A" />
          </svg>

          <h1 className="brand-title">
            {"Bus Booking".split("").map((char, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>

        {/* Nav Buttons */}
        <div className="nav-buttons flex gap-4 items-center">
          <button onClick={() => navigate("/home")} className="nav-btn px-4 py-2 text-gray-300 rounded-lg">
            Home
          </button>
          <button onClick={() => navigate("/about")} className="nav-btn px-4 py-2 text-gray-300 rounded-lg">
            About
          </button>
          <button onClick={() => navigate("/bookings")} className="nav-btn px-4 py-2 text-gray-300 rounded-lg">
            Bookings
          </button>
          <button onClick={handleLogout} className="logout-btn px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;