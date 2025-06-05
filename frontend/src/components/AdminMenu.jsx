import { useState } from "react";
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import {
  useCreateItemMutation,
  useItemsQuery,
  useDeleteItemMutation,
} from "../api/item";
import { toast } from "react-toastify";

const AdminMenu = () => {
  const { mutateAsync } = useCreateItemMutation();
  const {
    data: items,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useItemsQuery();
  const { mutateAsync: deleteItem } = useDeleteItemMutation();

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutateAsync(data, {
      onSuccess: () => {
        setData({
          name: "",
          description: "",
          price: "",
          imageUrl: "",
        });
        toast.success("New Item added!");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "failed to add a item");
      },
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    deleteItem(e.target.value, {
      onSuccess: () => {
        toast.success("Item removed");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to remove item");
      },
    });
  };

  return (
    <Container className="mt-4 bg-black text-white">
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="align-items-center mt-1">
          <Col sm={4}>
            <Form.Control
              className="bg-secondary text-white border-secondary"
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Control
              className="bg-secondary text-white border-secondary mt-1"
              as="textarea"
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Enter item description"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Control
              className="bg-secondary text-white border-secondary mt-1"
              type="number"
              name="price"
              value={data.price}
              onChange={handleChange}
              placeholder="Enter item price"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Control
              className="bg-secondary text-white border-secondary mt-1"
              type="text"
              name="imageUrl"
              value={data.imageUrl}
              onChange={handleChange}
              placeholder="Enter item image url"
              required
            />
          </Col>
        </Row>
        <Col sm={4}>
          <Button
            variant="outline-primary"
            type="submit"
            className="w-100 mt-2"
          >
            Submit
          </Button>
        </Col>
      </Form>

      <Row>
        {items?.map((cat) => (
          <Col sm={6} md={4} key={cat._id} className="mb-3">
            <Card bg="dark" text="white">
              <Card.Body>
                <Card.Title>{cat.name}</Card.Title>
                <Button
                  variant="outline-danger"
                  onClick={handleDelete}
                  value={cat._id}
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

export default AdminMenu;
