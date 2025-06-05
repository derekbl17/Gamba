import PrivateRoute from "./components/PrivateRoute";
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  NoAuthorization,
  ProfileScreen,
  AdminScreen,
  NotFoundScreen,
} from "./screens";

export const routes = [
  { index: true, element: <HomeScreen /> },
  { path: "login", element: <LoginScreen /> },
  { path: "register", element: <RegisterScreen /> },
  { path: "no-auth", element: <NoAuthorization /> },
  {
    path: "",
    element: <PrivateRoute allowed={["user", "admin"]} />,
    children: [{ path: "profile", element: <ProfileScreen /> }],
  },
  {
    path: "admin",
    element: <PrivateRoute allowed={["admin"]} />,
    children: [{ path: "panel", element: <AdminScreen /> }],
  },
  { path: "*", element: <NotFoundScreen /> },
];
