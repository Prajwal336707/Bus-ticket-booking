import React from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @keyframes navSlideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes btnPop {
    from { opacity: 0; transform: translateY(-8px) scale(0.92); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
`;

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{styles}</style>

      <div
        className="w-full h-14 bg-yellow px-8 flex justify-between items-center shadow-md fixed top-0 left-0 z-50"
        style={{ animation: "navSlideDown 0.45s cubic-bezier(0.22,1,0.36,1) both" }}
      >

        <h1
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => navigate("/admin")}
          style={{ animation: "fadeInLeft 0.5s 0.25s cubic-bezier(0.22,1,0.36,1) both" }}
        >
         
        </h1>

        <div
          className="flex gap-4 items-center"
          style={{ animation: "fadeInRight 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
        >

          {/* Dashboard */}
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200 transition"
            style={{ animation: "btnPop 0.38s 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            Dashboard
          </button>

          {/* Users */}
          <button
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200 transition"
            style={{ animation: "btnPop 0.38s 0.42s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            Users
          </button>

          {/* Buses */}
          <button
            onClick={() => navigate("/admin/buses")}
            className="px-4 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200 transition"
            style={{ animation: "btnPop 0.38s 0.49s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            Buses
          </button>

          {/* Bookings */}
          <button
            onClick={() => navigate("/admin/bookings")}
            className="px-4 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200 transition"
            style={{ animation: "btnPop 0.38s 0.56s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            Bookings
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            style={{ animation: "btnPop 0.38s 0.63s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
};

export default AdminNavbar;