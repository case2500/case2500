import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

const schema = yup.object().shape({
  name: yup.string().required("ชื่อสกุลห้ามว่าง"),
  email: yup
    .string()
    .required("อีเมล์ห้ามว่าง")
    .email("รูปแบบอีเมล์ไม่ถูกต้อง"),
  password: yup
    .string()
    .required("รหัสผ่านห้ามว่าง")
    .min(3, "รหัสผ่านต้อง 3 ตัวอักษรขึ้นไป"),
});

const RegisterPage = () => {
  const history = useHistory();
  const { addToast } = useToasts();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      alert(JSON.stringify(data))
      // console.log(data);
      const apiUrl = "http://localhost:8000/user/register";
      const resp = await axios.post(apiUrl, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      addToast(resp.data.message, { appearance: "success" });
      history.replace("/login");
    } catch (error) {
      addToast(error.response.data.errors.email[0], { appearance: "error" });
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={12} md={8}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="name">
              <Form.Label>ชื่อ-สกุล</Form.Label>
              <Form.Control
                type="text"
                name="name"
                ref={register}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
              {errors.name && (
                <Form.Control.Feedback type="invalid">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                ref={register}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                ref={register}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              สมัครสมาชิก
            </Button>
          </Form>

          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage
