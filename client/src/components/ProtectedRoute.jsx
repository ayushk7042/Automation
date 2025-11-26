import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Props:
 *  - children (component)
 *  - allowedRoles (optional) -> array like ['Admin','AM']
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // unauthorized
      return <div style={{ padding: 20 }}>403 — You don't have access to this page.</div>;
    }
  }

  // additional: enforce mustChangePassword
  if (user.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
};

export default ProtectedRoute;
