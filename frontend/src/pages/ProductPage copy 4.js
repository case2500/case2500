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
import { getUniqueValues } from '../utils/helpers'

const ProductPage = () => {
  const [search, setSearch] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [lastproduct, setLastProduct] = React.useState("");

  const [users, setUsers] = useState(product.slice(0, 2));
  const [pageNumber, setPageNumber] = useState(0);

  const usersPerPage = 12;
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
    const product = {
      id: p._id,
      name: p.name,
      price: p.price,  //สมมติว่า p.view คือ ราคา 
      qty: 1
    }
    //call action
    dispatch(addToCart(product, cart))
    setLastProduct(p.name)
    alert(p.name)
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
    alert(p.name)
  }
  const removeCart = (index, cart) => {
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
      alert(CategoryProduct)
      setUsers(product)
    } else {

      const CategorySuccess = product.filter((findName) => findName.category)
      alert(CategorySuccess)
      const timer = setTimeout(() => { CategorySuccess && setUsers(CategorySuccess) }, 100);
    }

  }


  const categories = getUniqueValues(product, 'category')

  return (
    <div className="container-fluid page" >
      <Wrapper >
        <div className='colHeight'>
          <div className='col'>
            {/* {categories} */}
            <div>

              <form onSubmit={(e) => e.preventDefault()}>
                {/* search input */}
                <div >
                  <input
                    type='text'
                    name='search'
                    placeholder='search'


                    onChange={(e) => searchProduct(e.target.value)}
                  />
                </div>
                {/* end search input */}
                {/* categories */}
                <div className='form-control'>
                  <h5>category</h5>
                  <div>
                    {categories.map((c, index) => {
                      return (
                        <button className='button'
                          key={index}
                          onClick={() => searchCategory(c)}
                          type='button'
                          name='category'
                        // className={`${category === c.toLowerCase() ? 'active' : null
                        //   }`}
                        >
                          {c}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* end of categories */}
                {/* companies */}
                {/* <div className='form-control'>
                  <h5>company</h5>

                </div> */}
                {/* end of companies */}
                {/* 
          colors
          */}
                {/* <div className='form-control'>
                  <h5>colors</h5>

                </div> */}
                {/* 
end of           colors
          */}
                {/* price */}
                {/* <div className='form-control'>
                  <h5>price</h5>

                  <input
                    type='range'
                    name='price'


                  />
                </div> */}
                {/* end of price */}
                {/* shippping */}
                {/* <div className='form-control shipping'>
                  <label htmlFor='shipping'> free shipping</label>
                  <input
                    type='checkbox'
                    name='shipping'
                    id='shipping'

                  />
                </div> */}
                {/* end of  shippping */}
              </form>
              {/* 
              <hr /> */}
              {/* <form>



                <label htmlFor='sort'>sort by</label>
                <select
                  name='sort'
                  id='sort'
                  className='sort-input'
                // value={sort}
                // onChange={updateSort}
                >
                  <option value='price-lowest'>price (lowest)</option>
                  <option value='price-highest'>price (highest)</option>
                  <option value='name-a'>name (a-z)</option>
                  <option value='name-z'>name (z-a)</option>
                </select>
              </form> */}
            </div>

            <div className='products'>
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
                    <div onClick={() => addCart(product)}>
                      {product.name}
                      {" "}  {" "}   {product.price}
                    </div>
                  </div>
                ))}
                
                
            </div>
            <div>



              <h5>   {
                total > 0 && <>ซื้อแล้ว {total} ชิ้น   </>
              }
                ยอดรวม{" "}{totalprice}  {" บาท"} </h5>
                <h5>รายการสั่งสินค้าล่าสุด{" "}{lastproduct}</h5>

              <div className='scrolly'>
                <Table striped bordered hover >
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อสินค้า</th>
                      <th>ราคา</th>
                      <th>จำนวน</th>
                      <th>รวม</th>
                      <th>รวม</th>
                    </tr>
                  </thead>
                  <tbody>

                    {cart.map((c, index) => {
                      return (
                        <>

                          <tr key={c.id}>

                            <td>{index + 1}</td>
                            <td>{c.name}</td>
                            <td>{c.price}</td>
                            <td>{c.qty}</td>
                            <td>{c.price * c.qty}</td>
                            <td><button onClick={() => removeCart(c.id, cart)}>x</button></td>
                            <td><button onClick={() => addCartOn(c)}>+</button>
                              <button onClick={() => addCartOn(c)}>-</button>
                            </td>

                          </tr>
                        </>
                      );

                    })}

                  </tbody>
                </Table>
                {cart.map((rank, index, arr) => {
                  if (arr.length - 1 === index) {
                    // alert(JSON.stringify(rank.name+rank.price))
                  } else {
                    // not last one
                  }
                })}

              </div>
            </div>
          </div>

        </div>
      </Wrapper>

      <hr></hr>
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
.pag{
  overflow-y: hidden;
  /* height: 620px; */
}
.products {
      grid-template-columns: 1fr;
      
    }
    .img {
     width: 400px;
     height: 175px;
    }

  @media (min-width:990px) {
    .products {
    background:#F8F8FF; 
    display: grid;
    grid-template-columns: 1fr  1fr 1fr 1fr ;
    gap: 1rem .09rem;
    margin: 2rem 0.5rem;
    width: 98%;
    
    /* overflow-y: scroll; */
  }
  .scrolly{
    overflow-y: scroll;
    /* height: 620px; */
  }
.button {
      background: transparent;
      border: 1px solid var(--clr-black);
      color: var(--clr-black);
      width: 1.5rem;
      border-radius: var(--radius);
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        font-size: 1rem;
      }
    }
  .colHeight{
    height: 650px ;

  }
  .col {
    display: grid;
    grid-template-columns: 1fr 3fr  2fr  ;
    gap: 0.05rem 0.05rem;
    margin: 4rem auto;
  
  }
  .img {
     width: 280px;
      height: 155px;
    }
  }




  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.5rem;
    button {
      background: transparent;
      border: 1px solid var(--clr-black);
      color: var(--clr-black);
      width: 1.5rem;
      border-radius: var(--radius);
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        font-size: 1rem;
      }
    }
    .active {
      background: var(--clr-black);
      color: var(--clr-white);
    }
  }

  .sort-input {
    border-color: transparent;
    font-size: 1rem;
    text-transform: capitalize;
    padding: 0.25rem 0.5rem;
  }
  label {
    font-size: 1rem;
    text-transform: capitalize;
  }
  .form-control {
    margin-bottom: 1.25rem;
    h5 {
      margin-bottom: 0.5rem;
    }
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
  }
  .search-input::placeholder {
    text-transform: capitalize;
  }

  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
   
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active {
    border-color: var(--clr-grey-5);
  }
  .company {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .colors {
    display: flex;
    align-items: center;
  }
  .color-btn {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.5rem;
      color: var(--clr-white);
    }
  }
  .all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
  .all-btn .active {
    text-decoration: underline;
  }
  .price {
    margin-bottom: 0.25rem;
  }
  .shipping {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    text-transform: capitalize;
    column-gap: 0.5rem;
    font-size: 1rem;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
  @media (min-width: 768px) {
    .content {
      position: sticky;
      top: 1rem;
    }
  }
`

export default ProductPage;
