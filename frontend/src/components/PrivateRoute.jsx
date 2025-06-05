import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ allowed }) => {
  const { user, isLoading } = useAuth();

  if (!user) {
    console.log("no user info");
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    console.log("no authorization");
    return <Navigate to="/no-auth" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
