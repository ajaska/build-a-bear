export const SET_SHOPPING_CART = Symbol('SET_SHOPPING_CART');

export function setShoppingCart({ courses }) {
  return {
    type: SET_SHOPPING_CART,
    courses,
  };
}
