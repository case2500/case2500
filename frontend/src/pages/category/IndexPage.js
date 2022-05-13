import React from "react";

import axios from "axios";
import { Table, Spinner, Button } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";

import { Link, useHistory } from "react-router-dom";

const IndexPage = () => {
  const [category, setCategory] = React.useState([""]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);

  const history = useHistory();

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(
        `http://localhost:8000/product`,
      );
      console.log(resp.data.data)
      //  alert(JSON.stringify(resp.data.data))
      setCategory(resp.data.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  if (loading === true) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <p>เกิดข้อผิดพลาดจาก Server กรุณาลองใหม่</p>
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-12">
            <Link
              to="/category/create"
              style={{ float: "right", margin: 0, width: 100 }}
              className="btn btn-success btn-lg"
            >
              เพิ่ม
            </Link>
            {/* <Button
              className="mb-3"
              variant="success"
              onClick={() => history.push("/category/create")}
            >



              เพิ่มข้อมูล
            </Button> */}

            <h2>รายการสินค้า</h2>

            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>ลำดับที่</th>
                  <th style={{ width: "20%" }}>ชื่อสินค้า</th>
                  <th style={{ width: "10%" }}>ราคา</th>
                  <th style={{ width: "10%" }}>อายุ</th>
                  <th style={{ width: "40%" }}>รูปภาพ</th>
                  <th >Action</th>
                </tr>
              </thead>
              <tbody>
                {category.map((c, index) => {
                  return (
                    <tr key={c.id}>
                      <td>{index + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.price}</td>
                      <td>{c.stock}</td>
                      <td>

                        <img
                          src={`http://localhost:8000/images/${c.image}`}
                          style={{ fontSize: 10, color: "black", width: "15%", height: "50%" }}

                        /></td>
                      <td>
                        <Button
                          className="ml-2"
                          variant="outline-info"
                          size="sm"
                          onClick={() => history.push('/category/edit/' + c._id)}
                        >
                          <BsPencil />
                        </Button>
                        <Button
                          className="ml-2"
                          variant="outline-danger"
                          size="sm"
                          onClick={async () => {
                            const isConfirm = window.confirm('แน่ใจว่าต้องการลบข้อมูล ' + c.name + c._id)
                            if (isConfirm === true) {
                              const resp = await axios.delete('http://localhost:8000/product/' + c._id)
                              // alert(resp.data.message)
                              history.go(0)
                            }
                          }}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
