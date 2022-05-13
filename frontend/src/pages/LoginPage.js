import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
// import {UserStoreContext} from '../context/UserContext'

import { updateProfile } from '../redux/actions/authAction'
import { useDispatch } from 'react-redux'

const schema = yup.object().shape({
  email: yup
    .string()
    .required("อีเมล์ห้ามว่าง")
    .email("รูปแบบอีเมล์ไม่ถูกต้อง"),
  password: yup
    .string()
    .required("รหัสผ่านห้ามว่าง")
    .min(3, "รหัสผ่านต้อง 3 ตัวอักษรขึ้นไป"),
});

const LoginPage = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  // const userStore = React.useContext(UserStoreContext);

  //call redux action
  const dispatch = useDispatch();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      alert(data.password)
      // console.log(data);
      const apiUrl = "http://localhost:8000/user/login";
      alert(apiUrl)
      const resp = await axios.post(apiUrl, {
        email: data.email,
        password: data.password,
      });

      //   console.log(resp.data)
      localStorage.setItem("token", JSON.stringify(resp.data));
      alert(JSON.stringify(resp.data.access_token))
      //get profile
      const urlProfile = "http://localhost:8000/user/me";
      const respProfile = await axios.get(urlProfile, {
        headers: {
          Authorization: "Bearer " + resp.data.access_token,
        },
      });
      //   console.log(respProfile.data.data.user)
      localStorage.setItem(
        "profile",
        JSON.stringify(respProfile.data.user)
      );

      addToast("เข้าระบบเรียบร้อยแล้ว", { appearance: "success" });

      // history.replace("/");
      // history.go(0);
      //update profile by context
      const profileValue = JSON.parse(localStorage.getItem('profile'));
      // userStore.updateProfile(profileValue) //Context
      //call action
      dispatch(updateProfile(profileValue))
      history.replace("/")

    } catch (error) {
      addToast(error.response.data.message, { appearance: "error" });
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={12} md={8}>
          <Form onSubmit={handleSubmit(onSubmit)}>
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
                className={`form-control ${errors.password ? "is-invalid" : ""
                  }`}
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              Log In
            </Button>
          </Form>

          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
