import axios from "axios";


import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  URL

} from '../constants/productConstants'


export const GET_PROFILE = "GET_PROFILE";
export const GET_PRODUCT = "GET_PRODUCT";

export const updateProfile = (profile) => {
  return {
    type: GET_PROFILE,
    payload: {
      profile: profile,
    },
  };
};

export const getProducts = ( currentPage = 1, price, category, rating = 0) => async (dispatch) => {
  try {

      dispatch({ type: ALL_PRODUCTS_REQUEST })

     // let link = `http://localhost:8000/api/products`
     let link = `${URL}/products`
   //  alert(link)
      // if (category) {
      //     link = `http://case2500.thddns.net:4333/api/products`
      // }

      const { data } = await axios.get(link)
      console.log(data )
      dispatch({
          type: ALL_PRODUCTS_SUCCESS,
          payload: data
      })

  } catch (error) {
      dispatch({
          type: ALL_PRODUCTS_FAIL,
          payload: error.response.data.message
      })
  }
}

// export const getProduct = () => {
//   return async (dispatch) => {
//     const resp = await axios.get("http://localhost:8000/api/v1/products")
//     alert(resp)
//     // const resp = await axios.get("https://api.codingthailand.com/api/version");
//     dispatch({
//       type: GET_PRODUCT,
//       payload: {
//         products: resp,
//       },
//     });
//   };

  // return {
  //     type: GET_VERSION,
  //     payload: {
  //         version: '1.0.0'
  //     }
  // }
//};
