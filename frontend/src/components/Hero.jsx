import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className=" py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">Gamba</h1>
          <p className="text-center mb-4">Welcome! Sign up or login to play</p>
          <div className="d-flex">
            <Button variant="primary" as={Link} to="/login" className="me-3">
              Sign In
            </Button>
            <Button variant="secondary" as={Link} to="/register">
              Register
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
