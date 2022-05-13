import React from "react"

import { Container, Form, Button, Row, Col } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { useHistory } from 'react-router-dom'

const schema = yup.object().shape({
  name: yup.string().required("ชื่อหมวดหมู่ห้ามว่าง"),
  price: yup.string().required("ชื่อหมวดหมู่ห้ามว่าง"),
  stock: yup.string().required("ชื่อหมวดหมู่ห้ามว่าง"),
  password: yup.string().required("ชื่อหมวดหมู่ห้ามว่าง"),
});

const CreatePage = () => {
  const history = useHistory()

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    alert(JSON.stringify(data))
    //  const apiUrl = "http://localhost:8000/product";
    // const resp = await axios.post(apiUrl, {
    //   name: data.name,
    //   price:data.price,
    //   description:data.description,
    //   stock:data.stock

    // })
  //  alert(resp.data.message) //บันทึกข้อมูลเรียบร้อย
   // history.replace('/category')
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={12} md={8}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="name">

              <Form.Label>หมวดหมู่ข่าว</Form.Label>

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

              {/* <br></br>
              <Form.Control
                type="text"
                name="description"
                ref={register}
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
              />
              {errors.description && (
                <Form.Control.Feedback type="invalid">
                  {errors.description.message}
                </Form.Control.Feedback>
              )} */}

              <br></br>
              <Form.Control
                type="text"
                name="price"
                ref={register}
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
              />
              {errors.price && (
                <Form.Control.Feedback type="invalid">
                  {errors.price.message}
                </Form.Control.Feedback>
              )}

              <br></br>
              <Form.Control
                type="text"
                name="stock"
                ref={register}
                className={`form-control ${errors.stock ? "is-invalid" : ""}`}
              />
              {errors.stock && (
                <Form.Control.Feedback type="invalid">
                  {errors.stock.message}
                </Form.Control.Feedback>
              )}

<br></br>
           

              <Form.Label>Large file input example</Form.Label>
              <Form.Control 
              type="file"
              name="image"
              ref={register}
               size="lg" />

            </Form.Group>
            <Button variant="primary" type="submit">
              บันทึก
            </Button>
          </Form>

          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePage;
