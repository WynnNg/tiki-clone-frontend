import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";

const RolePageRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const userRole = useSelector((state) => state.account.user.role);
  if (
    (isAdminRoute && userRole === "ADMIN") ||
    (!isAdminRoute && (userRole === "USER" || userRole === "ADMIN"))
  ) {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};

export default function ProtectedPage(props) {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  return (
    <>
      {isAuthenticated ? (
        <>
          <RolePageRoute>{props.children}</RolePageRoute>
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
