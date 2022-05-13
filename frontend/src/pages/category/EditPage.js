import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Link, useHistory, useParams } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap"
import "./stockCreate.css"
import axios from "axios";
import { httpClient } from "./../../utils/HttpClient";
// import {
//   server
// } from "./../../constants";
// import {apiUrl} from "../../constants";

export default function EditPage(props) {

  const [categorie, setCategorie] = useState([]);
  const [valueEdit, setValueEdit] = useState("");
  const history = useHistory()
  const { id } = useParams()

  const getData = React.useCallback(async () => {
    const resp = await axios.get(
      "http://localhost:8000/product/" + id)
    setValueEdit(resp.data.product)
  }, [id])


  React.useEffect(() => {
    getData();
    
  }, [id, getData]);

  const showForm = ({ values, handleChange, handleSubmit, setFieldValue, isSubmitting }) => {
    return (

      <div className="container " >
        <div className="card ">
          <div class="row">
            <div class="col-4">
            </div>
            <div class="col-8">
              <Col xs={12} md={8}>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="col-12 control-label" htmlFor="name">
                      Name
                    </label>
                    <div className="col-10">
                      <input
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        placeholder="โปรดระบุ"
                        className="form-control"
                        type="text"
                        id="name"
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 10 }}>
                    <label className="col-12 control-label" htmlFor="stock">
                      Stock
                    </label>
                    <div className="col-sm-10">
                      <div className="input-group">
                        <input
                          onChange={handleChange}
                          name="stock"
                          value={values.stock}
                          className="form-control"
                          type="number"
                        />
                        <span className="input-group-addon input-group-addon_custom">
                          PCS.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-12 control-label" htmlFor="price">
                      Price
                    </label>
                    <div className="col-sm-10">
                      <div className="input-group">
                        <input
                          onChange={handleChange}
                          name="price"
                          value={values.price}
                          className="form-control"
                          type="number"
                          id="price"
                        />
                        <span className="input-group-addon input-group-addon_custom">
                          ฿
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* <label className="col-12 control-label">
                    Category
                  </label>
                  <div className="input-group">
                    <select
                      onChange={handleChange}
                      name="brand_id"
                      id="brand_id"
                      value={values.brand_id}
                      className="form-control"
                    >
                      <option>เลือกชนิด</option>
                      {categorie && categorie.map((c, i) => (
                        <option key={i} value={c.catalogname}>
                          {c.catalogname}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="form-group" style={{ marginTop: 15 }}>
                    <div className="col-sm-12 col-sm-offset-2">
                      {showPreviewImage(values)}

                      <div className="wrap-upload-buttons control-label">
                        <ul className="btn-nav row" id="rcorners">
                          <li>
                            <span style={{ marginLeft: 2 }}>
                              <img
                                src={`${process.env.PUBLIC_URL
                                  }/images/ic_photo.png`}
                                style={{ width: 25, height: 20 }}
                              />
                              <span style={{ color: "#00B0CD", marginLeft: 10 }}>
                                {" "}
                                Add Picture{" "}
                              </span>
                              <input
                                onChange={e => {
                                  e.preventDefault();
                                  setFieldValue("file", e.target.files[0]); // for upload
                                  setFieldValue("file_obj", URL.createObjectURL(e.target.files[0])); // for preview image
                                }}
                                type="file"
                                name="image"
                                className="picupload"
                                multiple
                                accept="image/*"
                                style={{ padding: "20px 0" }}
                              />
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="box-footer" style={{ marginTop: 20, textAlign: "center" }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary pull-right"

                    >
                      Submit
                    </button>
                    <a
                      onClick={() => {
                        history.goBack();
                      }}
                      type="Button"
                      className="btn btn-default pull-right"
                      style={{ marginRight: 10 }}
                    >
                      Cancel
                    </a>
                  </div>
                  <br></br>
                </form>
              </Col>
            </div>

          </div>
        </div>
      </div>
    )
  }
  const showPreviewImage = values => {
    if (values.file_obj) {
      return <img src={values.file_obj} style={{ height: 100 }} />;
    } else if (values.image) {
      return <img src={`http://localhost:8000/images/${values.image}`} style={{ height: 100 }} />;
    }
  };

  return (
    <div className="content-wrapper">
      {JSON.stringify(valueEdit)}
      <section className="content" style={{ maxWidth: "80%" }}>
        <div className="box box-primary" style={{ marginTop: 70, textAlign: "center" }}>
          <div className="box-header with-border">
            <p className="box-title mt-8" style={{ fontSize: 30 }}>
              Create
            </p>
          </div>
          <div style={{ marginTop: 30, textAlign: "left" }}>

            <Formik
              enableReinitialize
           
              initialValues={valueEdit ? valueEdit : {}}
              onSubmit={(values, { setSubmitting }) => {
                let formData = new FormData()
                formData.append("id", values._id)
                formData.append("name", values.name)
                formData.append("price", values.price)
                formData.append("stock", values.stock)
                if(values.file){formData.append("image", values.file)}
                axios.put(`http://localhost:8000/product`, formData)
                // setSubmitting(false);
                alert("เพิ่มข้อมูลเรียบร้อย")
                window.location.href='/category'
               // history.push('/category');
                //history.go(0)
              }}
            >
              {(props) => showForm(props)}
            </Formik>
          </div>
        </div>
      </section>
    </div>
  );
}


