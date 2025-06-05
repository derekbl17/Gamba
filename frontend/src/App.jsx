import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Header, Loader } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/authContext";
import { routes } from "./routes";

function AppLayout() {
  const { isLoading } = useAuth();

  if (isLoading) return <Loader />;
  return (
    <div className="min-vh-100 bg-dark text-light font-monospace">
      <Header />
      <ToastContainer />
      <Container className="my-2">
        <Outlet />
      </Container>
    </div>
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
