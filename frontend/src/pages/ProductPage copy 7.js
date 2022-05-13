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
  }, [search]);

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
    //alert(p.name)
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
    //alert(p.name)
  }


  const addCartOn = (p) => {
    //alert(JSON.stringify(p))
    const product = {
      id: p.id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1
    }
    //call action
    dispatch(addToCart(product, cart))
    //alert(p.name)
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

    <div className="container-fluid " >


      <Wrapper >

        <div className="page" >
          <div>
            {toThaiDateString(date1)}
         
          </div>


          <div className='paginator' style={{ margin: "15px 5px 5px 5px " }} >
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

          <div  >
            <h1 style={{ margin: "1px 5px 5px 85px " }}>ชมรมมิตรสัมพันธ์ </h1>
            <form onSubmit={(e) => e.preventDefault()}
             style={{ margin: "-40px 5px 5px 500px " }}

             >
               {/* search input */}
               <div >
                 <input
                   type='text'
                   name='search'
                   placeholder='ค้นหาชื่อ'
                   onChange={(e) => searchProduct(e.target.value)}
                 />
               </div>
             </form>
          </div>

          <div >
            
          </div>

          <div>

            <h3 style={{ textAlign: 'left', color: "white", backgroundColor: "green", width: "95%" }} >ยอดรวม  {total} รายการ <br></br>{" "}ล่าสุด {" "}{lastproduct}

              <h1 style={{ textAlign: 'right', color: "white", backgroundColor: "green", width: "100%" }}>{totalprice}</h1>
            </h3>
          </div>

          <div className='category'>

          </div>


          <div className='product'>
            <div className='productdetail'>
              {users &&
                users.slice(pagesVisited, pagesVisited + usersPerPage).map((product) => (
                  <div key={product.id}>
                    <div>
                      <Image
                        className='img'
                        src={`http://localhost:8000/images/${product.image}`}
                        onClick={() => addCart(product)}
                      />
                    </div>
                    <div >
                      <div style={{ display: "flex" }}>
                    <h5><b style={{ textAlign: 'left',color:"green" }}> {product.name} </b>  </h5>{" "}  {""}  {"-"} {product.price}
                      </div>

                      <button className="btn  btn-primary"
                        style={{ width: '100px', margin: "0rem 1rem 0rem 0rem", padding: "1px 1px 1px 1px " }}
                        onClick={() => addCart(product)}>cash
                      </button>
                      <button className="btn  btn-success"
                        style={{ width: '100px', margin: "0rem 1rem 0rem 0rem", padding: "1px 1px 1px 1px " }}
                        onClick={() => addCartOnline(product)}>Online
                      </button>
                      <hr></hr>
                    </div>
                  </div>
                ))
                
                }
            </div>
          </div>

          <div>
            <Button className="btn  btn-success"
              style={{ width: '200px', margin: "3rem 0rem 1rem 2rem" }}
              onClick={() => addDatabase(cart)}><h5>บันทึก </h5>
            </Button>

            <Button className="btn  btn-danger"
              style={{ width: '200px', margin: "3rem 0rem 1rem 2rem" }}
              onClick={() => {
                dispatch(clearAllCart());
              }}><h5>ยกเลิก </h5></Button>
          </div>


          <div className='tableproduct'>
            <Table striped bordered hover  >
              <tbody>
                {cart.map((c, index) => {
                  return (
                    <>
                      <tr key={c.id}>
                        <td><h6>{index + 1}.{c.name} </h6>

                          {c.status > 0
                            ? <Button className="btn  btn-success" style={{ margin: '2px 2px 2px 2px', textAlign: 'center', width: '80px', height: '30px' }} onClick={() => addCartOn(c)}>Online</Button>
                            : <Button className="btn  btn-primary" style={{ textAlign: 'center', width: '80px', height: '30px' }} onClick={() => delCartOn(c)}>Cash</Button>
                          }



                          <Button className="btn  btn-danger"  style={{ textAlign: 'center', width: '80px', height: '30px' }} onClick={() => delCartOn(c)}>-</Button>
                        </td>
                        <td style={{ textAlign: 'center' }}><h6><b>{c.price} </b></h6>
                          <h5 style={{ textAlign: 'center', color: "red" }}>x <b>{c.qty} </b>
                          </h5>
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

      </Wrapper>

    </div>
  );
};
const Wrapper = styled.div`

.page{

      display: grid;
      grid-template-columns: 1fr 4fr 4fr 4fr ;
      grid-template-rows: 70px 180px 550px 60px;
      margin: 1rem ;
      background-color: #F8F8FF; 

      
  }
  .tableproduct{ 
    background-color: white;
    margin: -5rem 1rem 0rem 0.1rem;
    overflow-y: scroll;
    height: 630px;
 }



  .category{ 
    background-color: white;
    grid-row:2/4; 
    grid-column: 1/ 1;
    margin: 0rem 1rem;
    overflow-y: scroll;
 }
 .search{
    background-color: white; 
     grid-row:3/4; 
 
    margin: 2rem 1rem 2rem;
    padding: 1rem 0.5rem;
}
 .total{ background-color: #5352ed; 
    grid-column: 4/5; 
}
 .order{ background-color: #cbced4; 
  grid-row:3/4; 
  grid-column: 4/5;
 }    
 
 .button{
  background-color:green;

}
 .product{ 
  background-color: white;
  grid-column: 2/ 4;
  grid-row:2/4; 
  margin: 0rem 1rem;

  .productdetail{
    display: grid;
     grid-template-columns: 1fr  1fr 1fr 1fr 1fr;
    .img {
      width:180px;
     height: 150px;
     margin: 0.2rem ;
     border-top-left-radius: 20%;
     border-top-right-radius: 20%;
     border-bottom-left-radius:20%;
     border-bottom-right-radius:20%;
   
    } 


  }
 

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
