import { Navigate, Outlet } from "react-router-dom";

const isAuth = () => {
  const token = localStorage.getItem("token");
  return token !== null ? true : false;
};

export function PrivateRoutes() {
  return isAuth() ? <Outlet /> : <Navigate to="/SignIn" />;
}
