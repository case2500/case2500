import { GET_PROFILE, GET_PRODUCT} from "../actions/productAction";

const initState = {
  products:[],
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload.profile,
      };
    case GET_PRODUCT:
      return {
        ...state,
        products: action.payload.products.data,
      };
    default:
      return state;
  }
};

export default productReducer;
