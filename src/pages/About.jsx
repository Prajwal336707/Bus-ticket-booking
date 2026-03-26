import React from "react";

const About = () => {
  return (
    <div
      className="pt-20 px-6 min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Decorative background blobs */}
      <div
        style={{
          position: "fixed",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,38,38,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-80px",
          left: "-80px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <h1
        className="text-4xl font-bold text-center mb-10"
        style={{
          color: "#f87171",
          fontFamily: "'Georgia', serif",
          letterSpacing: "0.04em",
          textShadow: "0 0 40px rgba(248,113,113,0.4)",
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
        }}
      >
        About Our Bus Booking Service
      </h1>

      {/* About Section */}
      <div
        className="max-w-5xl mx-auto mb-10"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(248,113,113,0.25)",
          borderRadius: "1.25rem",
          padding: "2.5rem",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "#e2e8f0", letterSpacing: "0.02em" }}
        >
          Online Bus Ticket Booking
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: "1.85", fontSize: "1.05rem" }}>
          Our bus booking platform allows users to easily search, select and
          book bus tickets for different routes. Users can view available buses,
          check prices, and reserve seats quickly. The system provides a smooth
          and secure booking experience for passengers.
        </p>
      </div>

      {/* How Booking Works */}
      <h2
        className="text-3xl font-bold text-center mb-8"
        style={{
          color: "#e2e8f0",
          letterSpacing: "0.03em",
          fontFamily: "'Georgia', serif",
        }}
      >
        How Ticket Booking Works
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {[
          { step: "1", title: "Search Bus", desc: "Enter your departure city and destination to find available buses." },
          { step: "2", title: "Select Bus", desc: "Choose your preferred bus based on time, type, and price." },
          { step: "3", title: "Book Ticket", desc: "Confirm booking and view ticket details in your booking history." },
        ].map(({ step, title, desc }) => (
          <div
            key={step}
            className="p-6 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(248,113,113,0.2)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(248,113,113,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #dc2626, #f87171)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "1.1rem",
                color: "#fff",
                marginBottom: "1rem",
                boxShadow: "0 4px 16px rgba(220,38,38,0.4)",
              }}
            >
              {step}
            </div>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "#f87171", letterSpacing: "0.01em" }}
            >
              {title}
            </h3>
            <p style={{ color: "#94a3b8", lineHeight: "1.7" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <h2
        className="text-3xl font-bold text-center mb-8"
        style={{
          color: "#e2e8f0",
          letterSpacing: "0.03em",
          fontFamily: "'Georgia', serif",
        }}
      >
        Why Choose Our Service
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto" style={{ paddingBottom: "4rem" }}>
        {[
          { title: "Fast Booking", desc: "Book your bus tickets quickly without waiting in long queues." },
          { title: "Secure System", desc: "Your data and booking details are safe and protected." },
          { title: "Easy Management", desc: "Users can view booking history and admins can manage buses easily." },
        ].map(({ title, desc }) => (
          <div
            key={title}
            className="p-6 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(74,222,128,0.2)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #16a34a, #4ade80)",
                marginBottom: "1rem",
                boxShadow: "0 0 12px rgba(74,222,128,0.6)",
              }}
            />
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "#4ade80", letterSpacing: "0.01em" }}
            >
              {title}
            </h3>
            <p style={{ color: "#94a3b8", lineHeight: "1.7" }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;