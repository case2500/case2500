import React, { Fragment, useState, useEffect } from 'react'

import { Table, Image, Badge, Spinner, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from 'styled-components'
//redux
import { addToCart, delToCart, addToCartOn, removeCartAction, } from '../redux/actions/cartAction'
import { useDispatch, useSelector } from 'react-redux'
import CartPage from './CartPage'
import { date } from "yup/lib/locale";
import { syncIndexes } from "mongoose";
import ReactPaginate from "react-paginate";
import "./App.css";
import { getUniqueValues } from '../utils/helpers'
import { BsPencil, BsTrash } from "react-icons/bs";
import { clearAllCart } from "../redux/actions/cartAction";

const ProductPage = () => {
  const [search, setSearch] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [lastproduct, setLastProduct] = React.useState("");

  const [users, setUsers] = useState(product.slice(0, 2));
  const [pageNumber, setPageNumber] = useState(0);
  const [status, setStatus] = useState();

  const usersPerPage = 15;
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
    // return `${numOfDay}/${date.getMonth() + 1}/ ${year} `;
    return `${numOfDay} ${month} ${year} `
    // +`${hour}:${minutes}:${second} น.`;
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
  }, [search,status,dispatch]);

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
    // alert(JSON.stringify(p))
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = (date_ob.getFullYear() + 543);
    const product = {
      id: p._id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1,
      date: date + "-" + month + "-" + year,
      status: 0
    }
    //call action
    dispatch(addToCart(product, cart))
    setLastProduct(p.name)
    alert("บันทึกการชำระเงินสดเรียบร้อย " + p.name)
  }

  const addCartOnline = (p) => {
    // alert(JSON.stringify(p))
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = (date_ob.getFullYear() + 543);
    const product = {
      id: p._id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1,
      date: date + "-" + month + "-" + year,
      status: 1
    }
    //call action
    dispatch(addToCart(product, cart))
    setLastProduct(p.name)
    alert("บันทึกการชำระเงินโอนเรียบร้อย " + p.name)
  }


  const addCartOn = (p) => {
   // alert(JSON.stringify(p))
    const product = {
      id: p.id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1,
      status:1
    }
    //call action
   
    dispatch(addToCartOn(product, cart))
    //alert(p.name)
    window.location.href='/product'
  }

  const addDatabase = (cart) => {
    const cartDatabase = JSON.stringify(cart)
    // const product  ={
    //       cartDatabase
    // }

    axios.post('http://localhost:8000/order/', cart)
    alert((cartDatabase))
    dispatch(clearAllCart());
  }

  const delCartOn = (p) => {
    //alert(JSON.stringify(p))


    const product = {
      id: p.id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1,

    }
    //call action
    dispatch(delToCart(product, cart))
    //alert(p.name)
  }
  const removeCart = (index, cart, qty) => {
    // //call action
    dispatch(removeCartAction(index, cart, product))
  }
  const searchProduct = (searchProduct) => {
    if (searchProduct === "") {
      setUsers(product)
      // setSearch("")
    } else {
      //  setSearch(searchProduct)
      const sea = searchProduct && product.filter((findName) => findName.name.toLowerCase().includes(searchProduct.toLowerCase()))
      const timer = setTimeout(() => { sea && setUsers(sea) }, 100);
    }
  }

  const searchCategory = (CategoryProduct) => {
    if (CategoryProduct === "all") {
      //  alert(CategoryProduct)
      setUsers(product)
    } else {
      const CategorySuccess = product.filter((findName) => findName.category)
      // alert(CategorySuccess)
      const timer = setTimeout(() => { CategorySuccess && setUsers(CategorySuccess) }, 100);
    }
  }

  const categories = getUniqueValues(product, 'category')

  return (
    < Wrapper>

      <div className='header'>
        <input style={{ width: '200px', height: '30px', margin: "10px 10px 0px 90px " }}
          type="text" name="search" placeholder="ค้นหาชื่อ"
          onChange={(e) => searchProduct(e.target.value)}
        />
        <h1 style={{ textalign: 'right', color: "green", padding: "1px 200px 1px 1px " }}>

          {" "}{totalprice}{" "}บาท
        </h1>
      </div>

      <div className="container-fluid">
        < div className='main'>


          <div className='productdetail'>
            {users &&
              users.map((product) => (
                <div key={product.id}>
                  <div className="tag"  >{product.name}</div>
                  <div>
                    <Image
                      className='img'
                      src={`http://localhost:8000/images/${product.image}`}
                      onClick={() => addCart(product)}
                    />
                  </div>
                  <div >
                    <button className="btn  btn-primary"
                      style={{ width: '100px', margin: "1px 0rem 0rem 10px", padding: "1px 1px 1px 1px " }}
                      onClick={() => addCartOnline(product)}>โอน
                    </button>
                    <hr></hr>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="menu" style={{ margin: "1px 10px" }}>

            {toThaiDateString(date1)}   <h5 style={{ textalign: 'left', color: "black", width: "95%" }}>  {total}{" "} รายการล่าสุด {lastproduct}</h5>
            <div>
              <hr style={{ color: "white" }}></hr>
              <Button className="btn  btn-success"
                style={{ width: '100px', margin: "0rem 0rem 0.5rem 0rem", padding: "0rem 0rem 0rem 0rem" }}
                onClick={() => addDatabase(cart)}><h5>บันทึก </h5>
              </Button>

              <Button className="btn  btn-danger"
                style={{ width: '100px', margin: "0rem 0rem 0.5rem 1rem", padding: "0rem 0rem 0rem 0rem" }}
                onClick={() => {
                  dispatch(clearAllCart());
                }}><h5>ยกเลิก </h5></Button>
            </div>



            <div className='tableorder'>
              <Table striped bordered hover  >
                <tbody>
                  {cart.map((c, index) => {
                    return (
                      <>
                        <tr key={c._id}>
                          <td style={{ textAlign: 'left', width: '180px', height: '30px' }}><b> {index + 1}.{c.name} </b>
                          </td>
                          <td>
                            {c.status > 0
                              ? <Button className="btn  btn-primary" style={{ padding: '0px 1px 1px 1px', textAlign: 'center', width: '80px', height: '30px' }} onClick={() => addCartOn(c)}>โอน</Button>
                              : <Button className="btn  btn-success" style={{ padding: '0px 1px 1px 1px', textAlign: 'center', width: '80px', height: '30px' }} onClick={() => addCartOn(c)}>สด</Button>
                            }
                            <Button className="btn  btn-danger" style={{ margin: '0px 0px 0px 5px', padding: '0px 1px 1px 1px', textAlign: 'center', width: '80px', height: '30px' }} onClick={() => delCartOn(c)}>-</Button>
                          </td>
                          <td style={{ textAlign: 'center' }}><h6><b>{c.price} x <b style={{ textAlign: 'center', color: "red" }}>{c.qty} </b></b></h6>

                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              onClick={() => removeCart(c.id, cart, c.qty)}><BsTrash />
                            </Button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className='footer'>
    <b>Power by Mr Thoy80  (2022)</b>    
      </div>

    </ Wrapper>
  );
};
const Wrapper = styled.div`
.main {
            width: 98%;
            height: 350px;
            display: grid;
            grid-gap: 3px;
             margin: 0px 0px 0px 20px;

            grid-template-areas:
                "h h h h h h h h h h h h"
                "c c c c c c c c c c  m m"
                "f f f f f  f f f f f f f"
        }

        .header {
          display: flex;
          justify-content: space-between;
            grid-area: h;
            /* overflow: auto; */
            text-align: right;
            z-index: 1;width: 98%;
        }

        .menu {
            grid-area: m;
        
            background-color: #F5F5F5;
            /* overflow: scroll; */
            word-break: break-all;
            text-align: center;
            /* word-wrap: break-word; */
             min-width:550px; 
            height: 150px;
        }
        .tag {
          z-index: 1;
    /* position: absolute; */
    width:100px;
    text-align: center;
    /* top: 30px;
    left: 50%; */
    /* transform: translateX(-50%); */
    
     /* background: #1E90FF;  */
    margin: 0.5rem 1rem 0rem 0.6rem;
    /* border-radius: 5px; */
    color: rgb(14, 4, 4);
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
}
        
  .productdetail{
    grid-area: c;
    box-shadow: 1px 1px 2px 1px grey;    
    overflow: scroll;
     display: grid;
     grid-template-columns: 1fr  1fr 1fr 1fr ;
     margin: 1px 0rem 0rem 10px;
     height: 500px;
     /* border: 1px solid grey; */
     background: white;
    .img {    
     width:100px;
     height: 80px;
     margin: 1px 0rem 0rem 10px;
     /* border-top-left-radius: 5%;
     border-top-right-radius: 5%;
     border-bottom-left-radius:5%;
     border-bottom-right-radius:5%; */
     &:hover{
	cursor: pointer;
  margin: 3px 0rem 0rem 8px;
	opacity: 0.8;
  box-shadow: 1px 1px 2px 2px grey;
  width:105px;

    } 
    } 
 }
 .tableorder{ 
    background-color: white;
    /* margin: -5rem 1rem 0rem 0.1rem; */
    overflow-y: scroll;
    height: 380px;
    border: 1px solid grey;
 }
 .footer {

  text-align: center;  
     width:100%;
     height: 40px;
     margin: 160px 0rem 0rem 0px;
     padding: 2px 1rem 0rem 0px;
     /* background-color: blue; */
     color:black
            /* background-color: rgb(121, 233, 253); */
        }
 .paginator{
  /* background-color: white; */
  grid-column: 5/ 1;
  grid-row: 4/-1; 
 }
 .price{ background-color: #00d2d3;
  grid-column: 4/1;
  grid-row:2/4; 
  }
 
  
`

export default ProductPage;
