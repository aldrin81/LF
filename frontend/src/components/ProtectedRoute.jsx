import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, userRole } = useApp();

  // ❌ not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // ❌ role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;