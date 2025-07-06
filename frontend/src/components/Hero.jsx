import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card w-75 custom-container">
          <h1 className="text-center mb-4">Gamba</h1>
          <h5 className="text-center mb-4">
            Welcome! Sign up or login to play
          </h5>
          <div className="d-flex">
            <Button
              variant="outline-warning"
              as={Link}
              to="/login"
              className="me-3"
            >
              Sign In
            </Button>
            <Button variant="outline-warning" as={Link} to="/register">
              Register
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
