import { Container, Row, Col, Card } from "react-bootstrap";
import { AdminMenu, AdminUserList } from "../components";

const AdminScreen = () => {
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm bg-black">
            <Card.Body>
              <h1 className="mb-4 text-light">Manage Menu</h1>
              <AdminMenu />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="shadow-sm bg-black">
            <Card.Body>
              <h1 className="mb-4 text-light">Manage Users</h1>
              <AdminUserList />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminScreen;
