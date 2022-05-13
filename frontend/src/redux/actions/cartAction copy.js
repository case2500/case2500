import { el } from "date-fns/locale";

export const ADD_TO_CART = "ADD_TO_CART";
export const CLEAR_ALL_CART = "CLEAR_ALL_CART";
export const REMOVE_CART = "REMOVE_CART";

export const addToCartOn = (product = {}, cart = []) => {
  let exists = false;

  if (cart.length > 0) {
    for (const c of cart) {
      if (c.id === product.id) {
        
        c.qty++;
        exists = true;
      }
    }
  }

  if (!exists) {
    cart.push(product);
  }

  const total = cart.reduce((totalQty, product) => totalQty + product.qty, 0);
  const totalprice = cart.reduce((totalQty, product) => totalQty + product.qty * product.price, 0);
  // alert(totalprice)
  return {
    type: ADD_TO_CART,
    payload: {
      cart: cart,
      total: total,
      totalprice: totalprice,
    }
  }
}

export const addToCart = (product = {}, cart = []) => {
  let exists = false;

  if (cart.length > 0) {
    for (const c of cart) {
      if (c.id === product.id) {
        c.qty++;
        exists = true;
      }
    }
  }

  if (!exists) {
    cart.push(product);
  }

  const total = cart.reduce((totalQty, product) => totalQty + product.qty, 0);
  const totalprice = cart.reduce((totalQty, product) => totalQty + product.qty * product.price, 0);
  // alert(totalprice)
  return {
    type: ADD_TO_CART,
    payload: {
      cart: cart,
      total: total,
      totalprice: totalprice,
    }
  }
}
//delToCart
export const delToCart = (product = {}, cart = []) => {
  let exists = false;
  const totalCart = cart

  for (const c of cart) {
    if (c.id === product.id) {
      if (c.qty > 1) {
        c.qty--;
        exists = true;
      }

    }
  }

  const total = totalCart.reduce((totalQty, product) => totalQty + product.qty, 0);
  const totalprice = totalCart.reduce((totalQty, product) => totalQty + product.qty * product.price, 0);
  // alert(totalprice)
  return {
    type: ADD_TO_CART,
    payload: {
      cart: totalCart,
      total: total,
      totalprice: totalprice,
    }
  }

}
export const addToCartExists = (product = {}, cart = []) => {
  let exists = false;

  if (cart.length > 0) {
    for (const c of cart) {
      if (c.id) {
        c.qty++;
        exists = true;
      }
    }
  }

  if (!exists) {
    cart.push(product);
  }

  const total = cart.reduce((totalQty, product) => totalQty + product.qty, 0);

  const totalprice = cart.reduce((totalQty, product) => totalQty + product.qty * product.price, 0);
  alert(totalprice)
  return {
    type: ADD_TO_CART,
    payload: {
      cart: cart,
      total: total,
      totalprice: totalprice,
    },
  };
};
export const removeCartAction = (id, cart, qty) => {

  // alert(index)
  const total = cart.reduce((totalQty, product) => totalQty + product.qty, 0);
  const amount = total - qty
  //  const newOrders = [...cart];
  // const cartnew = cart.splice((index), 1);
  // cart.push(product);
  // alert(total)

  const totalprice = cart.reduce((totalQty, cart) => totalQty + cart.qty * cart.price, 0);

  const toatalCart = cart.length
  // alert(totalprice)
  return {
    type: REMOVE_CART,
    payload: {
      cart: cart.filter((x) => x.id !== id),
      totalprice: cart.filter((x) => x.id !== id).reduce((totalQty, cart) => totalQty + cart.qty * cart.price, 0),
      total: cart.filter((x) => x.id !== id).reduce((totalQty, cart) => totalQty + cart.qty, 0),
    }
  }
};

export const clearAllCart = () => {
  const cart = [];
  const total = 0;

  return {
    type: CLEAR_ALL_CART,
    payload: {
      cart: cart,
      total: total,
      totalprice: 0
    },
  };
};
