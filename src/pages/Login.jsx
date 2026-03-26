import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save token
      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", String(res.data.user.isAdmin));
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1600&q=80');
          background-size: cover;
          background-position: center;
          filter: brightness(0.35) saturate(0.6);
          z-index: 0;
        }

        .login-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(180, 0, 0, 0.18) 0%,
            rgba(0, 0, 0, 0.7) 60%,
            rgba(0, 0, 0, 0.95) 100%
          );
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 420px;
          padding: 52px 44px 48px;
          background: rgba(10, 10, 10, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-top: 2px solid #cc1a1a;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 40px 80px rgba(0, 0, 0, 0.7),
            0 0 60px rgba(180, 0, 0, 0.08);
          animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-eyebrow {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          color: #cc1a1a;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .login-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 52px;
          letter-spacing: 3px;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 36px;
        }

        .login-divider {
          width: 40px;
          height: 2px;
          background: #cc1a1a;
          margin-bottom: 36px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-wrap {
          position: relative;
        }

        .input-label {
          display: block;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }

        .login-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .login-input:focus {
          border-color: #cc1a1a;
          background: rgba(204, 26, 26, 0.06);
          box-shadow: 0 0 0 3px rgba(204, 26, 26, 0.12);
        }

        .login-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px rgba(10,10,10,0.9) inset;
          -webkit-text-fill-color: #ffffff;
        }

        .login-btn {
          margin-top: 8px;
          width: 100%;
          padding: 15px;
          background: #cc1a1a;
          color: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 3px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
        }

        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-btn:hover {
          background: #e01f1f;
          box-shadow: 0 6px 24px rgba(204, 26, 26, 0.45);
          transform: translateY(-1px);
        }

        .login-btn:active {
          transform: translateY(0px);
          box-shadow: none;
        }

        .login-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="login-root">
        <div className="login-bg" />

        <div className="login-card">
          <p className="login-eyebrow">Welcome Back</p>
          <h2 className="login-title">Login</h2>
          <div className="login-divider" />

          <form onSubmit={handleLogin} className="login-form">

            <div className="input-wrap">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="login-input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-wrap">
              <label className="input-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="login-input"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-btn">
              LOGIN
            </button>

          </form>

          <p className="login-footer">Secured access · All rights reserved</p>
        </div>
      </div>
    </>
  );
};

export default Login;