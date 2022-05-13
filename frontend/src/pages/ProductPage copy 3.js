import React, { Fragment, useState, useEffect } from 'react'

import { Table, Image, Badge, Spinner, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from 'styled-components'
//redux
import { addToCart, addToCartOn, removeCartAction } from '../redux/actions/cartAction'
import { useDispatch, useSelector } from 'react-redux'
import CartPage from './CartPage'
import { date } from "yup/lib/locale";
import { syncIndexes } from "mongoose";
import ReactPaginate from "react-paginate";
import "./App.css";

const ProductPage = () => {
  const [product, setProduct] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);

  const [users, setUsers] = useState(product.slice(0, 2));
  const [pageNumber, setPageNumber] = useState(0);

  const usersPerPage = 8;
  const pagesVisited = pageNumber * usersPerPage;

  const displayUsers = users.slice(pagesVisited, pagesVisited + usersPerPage).map((p) => {
    return (
      <>
        <Image
          src={`http://localhost:8000/images/${p.image}`}

          width={100}
        />
        <br></br>
        <h5 className="mt-2">{p.name}{p.price}  </h5>

      </>
    );
  });

  const pageCount = Math.ceil(users.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  //redux
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cartReducer.cart);
  const total = useSelector(state => state.cartReducer.total);
  const totalprice = useSelector(state => state.cartReducer.totalprice);

  const start = Date.now();

  function toThaiDateString(date) {
    let monthNames = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
      "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม.",
      "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    let year = date.getFullYear() + 543;
    let month = monthNames[date.getMonth()];
    let numOfDay = date.getDate();

    let hour = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let second = date.getSeconds().toString().padStart(2, "0");
    return `${numOfDay}/${date.getMonth() + 1}/ ${year} `;
    // return `${numOfDay} ${month} ${year} ` +
    //     `${hour}:${minutes}:${second} น.`;
  }

  let date1 = new Date();
  let date2 = new Date("September 30, 2020 11:28:00");
  let date3 = new Date("March 12, 1988 00:00:00");

  console.log(toThaiDateString(date1));
  // console.log(toThaiDateString(date2));
  // console.log(toThaiDateString(date3));



  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(
        "http://localhost:8000/product",
        {
          cancelToken: cancelToken.current.token,
        }
      );
      // alert(JSON.stringify(resp.data.data))
      console.log(resp.products)
      setProduct(resp.data.data);
      setUsers(resp.data.data)
      //alert(users)

    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    cancelToken.current = axios.CancelToken.source();

    getData();

    return () => {
      // console.log('exit product page')
      cancelToken.current.cancel();
    };
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
        <p>{error.response.data.message}</p>
      </div>
    );
  }

  const addCart = (p) => {
    alert(JSON.stringify(p))
    const product = {
      id: p._id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1
    }
    //call action
    dispatch(addToCart(product, cart))
  }
  const addCartOn = (p) => {
    alert(JSON.stringify(p))
    const product = {
      id: p.id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1
    }
    //call action
    dispatch(addToCart(product, cart))
  }
  const removeCart = (index, cart) => {
    // //call action
    dispatch(removeCartAction(index, cart, product))
  }

  return (
    <div className="container" >
      {/* <div className="row mt-5 margin: 5px 5px 5px 5px">
        {users.slice(pagesVisited, pagesVisited + usersPerPage).map((p) => {
          return (
            <div key={p.id} >
              <Image
                src={`http://localhost:8000/images/${p.image}`}
                width={200}
              />
              <br></br>
              {p.name}
            </div>
          );
        })}


      </div> */}
      <div className='row' style={{ fontSize: 18, color: "black",height:"700px" }}>
        <div className="col-md-9 ">
          <div className="row mt-5 " style={{ fontSize: 10, color: "black", margin: "0em 0em 0em 0em" }}>
            {users &&
              users.slice(pagesVisited, pagesVisited + usersPerPage).map((product) => (
                <div
                  className="col-md-4 mt-3 "
                  key={product.id}
                >
                  <Image
                    src={`http://localhost:8000/images/${product.image}`}
                    style={{ fontSize: 10, color: "black", width:"100%",height:"150px" }}
                   onClick={() => addCart(product)}
                  />


                  <Button variant="outline-secondary mt-1 "
                    onClick={() => addCart(product)}
                    style={{ fontSize: 10, background: "grey",color:"white",width:"100%" }}
                  >
                    {product.name}
                    {" "}  {" "}   {product.price}
                  </Button>
         
                </div>
              ))}

          </div>
       
        </div>
 
        <div className="col-md-2  ">
          {/* <div >
            <h5>   {
              total > 0 && <>ซื้อแล้ว {total} ชิ้น   </>
            }</h5>

          </div> */}
          <h5>     วันที่ {toThaiDateString(date1)}  </h5>
          <h5>ซื้อแล้ว {total} ชิ้น  ยอดรวม{" "}{totalprice}  {" บาท"} </h5>
          <Table striped bordered hover style={{ fontSize: 16, color: "black", margin: "0em 0em 1em 0.5em" }}>
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>จำนวน</th>
                <th>รวม</th>
              </tr>
            </thead>
            <tbody>
              {/* {JSON.stringify(cart)} */}
              {cart.map((c, index) => {
                return (
                  <tr key={c.id}>
                    <td>{index + 1}</td>

                    <td>{c.name}</td>
                    <td>{c.price}</td>
                    <td>{c.qty}</td>
                    <td>{c.price * c.qty}</td>
                    <td><button onClick={() => removeCart(c.id, cart)}>X</button></td>
                    <td><button onClick={() => addCartOn(c)}>+</button></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

<Wrapper>
<div className='products'>
       {users &&
              users.slice(pagesVisited, pagesVisited + usersPerPage).map((product) => (
                <div
                  className="col-md-4 mt-3 "
                  key={product.id}
                >
                  <Image
                    src={`http://localhost:8000/images/${product.image}`}
                    style={{ fontSize: 10, color: "black", width:"100%",height:"150px" }}
                   onClick={() => addCart(product)}
                  />


                  <Button variant="outline-secondary mt-1 "
                    onClick={() => addCart(product)}
                    style={{ fontSize: 10, background: "grey",color:"white",width:"100%" }}
                  >
                    {product.name}
                    {" "}  {" "}   {product.price}
                  </Button>
         
                </div>
              ))}

</div>


</Wrapper>

      </div> <hr></hr>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div>
  );
};
const Wrapper = styled.div`
  .products {
    display: grid;
    gap: 3rem 1.5rem;
    margin: 4rem auto;
  }
  @media (min-width: 768px) {
    .products {
      grid-template-columns: 200px 1fr;
    }
  }
`

export default ProductPage;
