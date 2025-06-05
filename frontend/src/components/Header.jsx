import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaUserCircle,
  FaUserPlus,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Header() {
  const { logout, user } = useAuth();

  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className=" border-bottom border-warning"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center"
          >
            <img
              alt="Poster"
              style={{ height: "80px" }} // Control image size
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              {user ? (
                <>
                  <NavDropdown
                    title={
                      <>
                        <FaUser /> {user.name}
                      </>
                    }
                    id="user-dropdown"
                    align="end"
                    className="hover-bg-primary-dark"
                    menuVariant="dark"
                  >
                    {user.role === "admin" && (
                      <>
                        <NavDropdown.Item
                          as={NavLink}
                          to="/admin/panel"
                          className="dropdown-item-hover"
                        >
                          <FaCog /> Admin Panel
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Item
                      as={NavLink}
                      to="/profile"
                      className="dropdown-item-hover"
                    >
                      <FaUserCircle /> Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={logoutHandler}
                      className="dropdown-item-hover text-danger"
                    >
                      <FaSignOutAlt /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/login"
                    className="px-3 py-2 hover-bg-primary-dark"
                  >
                    <FaSignInAlt className="me-1" /> Sign In
                  </Nav.Link>

                  <Nav.Link
                    as={NavLink}
                    to="/register"
                    className="px-3 py-2 hover-bg-primary-dark"
                  >
                    <FaUserPlus className="me-1" /> Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
