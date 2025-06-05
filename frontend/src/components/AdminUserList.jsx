import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../api/user";
import { toast } from "react-toastify";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const AdminUserList = () => {
  const { data: users } = useGetAllUsersQuery();
  const { mutateAsync: deleteUser } = useDeleteUserMutation();
  const { mutateAsync: toggleBlock } = useToggleUserStatusMutation();

  const handleDelete = async (e) => {
    e.preventDefault();
    deleteUser(e.target.value, {
      onSuccess: () => {
        toast.success("user removed");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to remove user");
      },
    });
  };

  const handleBlock = async (e) => {
    e.preventDefault();
    toggleBlock(e.target.value, {
      onSuccess: () => {
        toast.success("user status changed");
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to change user status"
        );
      },
    });
  };
  return (
    <Container className="mt-4 bg-black">
      <Row>
        {users?.map((user) => (
          <Col sm={6} md={4} key={user._id} className="mb-3">
            <Card className="bg-dark text-light">
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <Button
                  variant={
                    user.role === "user" ? "outline-warning" : "outline-success"
                  }
                  onClick={handleBlock}
                  value={user._id}
                  className="me-2"
                  size="sm"
                >
                  {user.role === "user" ? "Block" : "Unblock"}
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleDelete}
                  value={user._id}
                  size="sm"
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminUserList;
