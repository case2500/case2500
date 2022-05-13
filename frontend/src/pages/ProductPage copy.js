import React from "react";

import { Table, Image, Badge, Spinner } from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

//redux
import { addToCart,addToCartOn,removeCartAction } from '../redux/actions/cartAction'
import { useDispatch, useSelector } from 'react-redux'
import CartPage from './CartPage'
import { date } from "yup/lib/locale";
import { syncIndexes } from "mongoose";


const ProductPage = () => {
  const [product, setProduct] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);



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
    return `${numOfDay}/${date.getMonth()+1}/ ${year} `;
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
    dispatch(removeCartAction(index,cart,product))
  }

  return (
    <div className="container">

      <div className="row">

        <div className="col-md-8 mt-4">

   <h5>     วันที่ {toThaiDateString(date1)}  </h5>
         
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>id</th>
                <th>ชื่อคอร์ส</th>
                <th>รายละเอียด</th>
                <th>วันที่สร้าง</th>
                <th>views</th>
                <th>รูปภาพ</th>

              </tr>
            </thead>
            <tbody>
              {product && product.map((p, index) => {
                return (
                  <tr key={p._id}>
                    <td>{index + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>
                  {toThaiDateString(date1)}   
                    </td> 
                    <td>
                      {/* <Badge variant="success">{p.image}</Badge> */}
                      {p.image}
                    </td>
                    <td>
                  <image  src={`http://localhost:8000/images/${p.image}`}></image>
                      <Image
                        src={`http://localhost:8000/images/${p.image}`}
                        thumbnail
                        
                        width={100}
                      />
                    </td>
                    <td>
                      <Link to={`/detail/${p.id}/title/${p.name}`}>
                        <BsEyeFill />
                      </Link>
                      <button onClick={() => addCart(p)} className="btn btn-outline-success ml-2">
                        ชำระเงิน
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div className="col-md-4 mt-4">
          {/* {
            total > 0 && <h4>ซื้อแล้ว {total} ชิ้น</h4>
          } */}
         
          <div style={{ textAlign: 'right', justifyContent: "flex-end" }}>
        <h5>   {
            total > 0 && <>ซื้อแล้ว {total} ชิ้น   </>
          }     
           
            ยอดรวม{" "}{totalprice}  {" บาท"} </h5>
          </div>
          <Table striped bordered hover>
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
              {JSON.stringify(cart)}
              {cart.map((c, index) => {
                return (
                  <tr key={c.id}>
                    <td>{c.id}</td>

                    <td>{c.name}</td>
                    <td>{c.price}</td>
                    <td>{c.qty}</td>
                    <td>{c.price * c.qty}</td>
                    <td><button onClick={() => removeCart(c.id,cart)}>X</button></td>
                    <td><button onClick={() => addCartOn(c)}>+</button></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
