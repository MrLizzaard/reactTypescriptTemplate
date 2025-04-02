// src/components/RequireAuth.tsx
import React, { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }: { children: React.ReactElement }): ReactElement | null => {
  const accessToken = localStorage.getItem("access_token");
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
