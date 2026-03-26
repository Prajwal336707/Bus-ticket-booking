import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchTotalUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/total-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalUsers(res.data.totalUsers || 0);
    } catch (err) {
      console.error("Failed to fetch total users:", err);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="pt-24 px-10 min-h-screen bg-gray-950">

        {/* Header Section */}
        <div className="mb-8">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="bg-blue-600 bg-opacity-20 rounded-xl p-3">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total Users</p>
              <p className="text-white text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">

          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg">Registered Users</h2>
            <span className="bg-blue-600 bg-opacity-20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
              {totalUsers} total
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-6 py-16 text-center text-gray-400 text-sm">
              <svg className="animate-spin w-6 h-6 mx-auto mb-3 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading users...
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="px-6 py-16 text-center text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 bg-opacity-60">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-800 hover:bg-opacity-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-gray-500 text-sm">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 bg-opacity-30 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white text-sm font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                  </tr>
                ))}

                {/* Empty State */}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center text-gray-500 text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  );
};

export default AdminUsers;