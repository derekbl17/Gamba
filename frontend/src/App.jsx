import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Header, Loader, Background } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/authContext";
import { routes } from "./routes";

function AppLayout() {
  const { isLoading } = useAuth();

  if (isLoading) return <Loader />;
  return (
    <Background>
      <Header />
      <ToastContainer />
      <Outlet />
    </Background>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: routes,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
