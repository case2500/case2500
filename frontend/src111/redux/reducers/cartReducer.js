import { ADD_TO_CART, CLEAR_ALL_CART,REMOVE_CART } from "../actions/cartAction";

const initState = {
  cart: [],
  total: 0,
  totalprice:0
};

const cartReducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: action.payload.cart,
        total: action.payload.total,
        totalprice: action.payload.totalprice
      };
      case REMOVE_CART:
        return {
          ...state,
          cart: action.payload.cart,
          total: action.payload.total,
          totalprice: action.payload.totalprice
        }; 
      case CLEAR_ALL_CART:
        return {
          ...state,
          cart: action.payload.cart,
          total: action.payload.total,
          totalprice: action.payload.totalprice
        };  
    default:
      return state;
  }
};

export default cartReducer;
