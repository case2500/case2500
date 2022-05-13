import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'
import { BsFillHeartFill } from "react-icons/bs";
import { Table, Image, Badge, Spinner } from "react-bootstrap";

import { useQuery } from "react-query";
import axios from "axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

//redux
import { addToCart } from '../redux/actions/cartAction'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../redux/actions/productAction'
import Product from './product/Product'

const HomePage = () => {

  const [product, setProduct] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([1, 1000])
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)

  //redux
  const dispatch = useDispatch();


  const { products, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.productReducer.products)
  const cart = useSelector(state => state.cartReducer.cart);
  const total = useSelector(state => state.cartReducer.total);

  // const keyword = match.params.keyword

  React.useEffect(() => {
    // cancelToken.current = axios.CancelToken.source();

    //getData();
    dispatch(getProducts( currentPage, price, category))
    // return () => {
    //   // console.log('exit product page')
    //   cancelToken.current.cancel();
    // };
  }, [dispatch, alert, error, currentPage, price, category]);

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
    // console.log(p);
    const product = {
      id: p.id,
      name: p.title,
      price: p.view,  //สมมติว่า p.view คือ ราคา 
      qty: 1
    }
    //call action
    dispatch(addToCart(product, cart))
  }

  function setCurrentPageNo(pageNumber) {
    alert("ok")
    setCurrentPage(pageNumber)
  }


  let count = productsCount;
  //   if (keyword) {
  //       count = filteredProductsCount
  //   }

  return (
    <div className="container">

      <div className="col-6 col-md-9">
        <div className="row">
          {products && products.map(product => (
            <Product key={product._id} product={product} col={4} />
          ))}
        </div>
      </div>


  
    </div>
  )

}

export default HomePage;
