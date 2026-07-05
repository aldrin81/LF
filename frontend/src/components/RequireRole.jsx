import React from "react";
import { useApp } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const RequireRole = ({ allowedRoles = [], children }) => {
  const { isLoggedIn, userRole } = useApp();

  // not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // role check
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireRole;