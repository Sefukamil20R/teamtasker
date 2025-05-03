import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth-provider";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />; // Redirect to unauthorized page if role doesn't match
  }

  return children;
};

export default ProtectedRoute;