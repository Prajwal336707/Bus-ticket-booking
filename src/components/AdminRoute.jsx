import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

  const isAdmin = localStorage.getItem("isAdmin");

  if (isAdmin === "true") {
    return children;
  }

  return <Navigate to="/login" />;
};

export default AdminRoute;