import { finalizeOrder, login, loginError, logout } from "./manageCart";
import { getGrandTotal } from "./utils/helpers";
import { loginUser, submitOrder } from "./utils/util";

const isDev = process.env.NODE_ENV === "development";
export const URL = isDev ? 
  "http://localhost:3000/api/v1" :
  "https://queenmarymedical.herokuapp.com/api/v1";

export const loginService = (loginData) => async (dispatch) => {
  try {
    const response = await loginUser(loginData.email, loginData.password);
    
    dispatch(login(response));
  } catch (error) {
    dispatch(loginError((error)));
  }
};

export const logoutService = () => async (dispatch) => {
  try {
    dispatch(logout());
  } catch (error) {
    console.log("Error logging out");
  }
}

export const submitNewOrder = (order, coupon) => async (dispatch) => {
  let total = getGrandTotal(order.cart, coupon);
  const response = await submitOrder({ ...order, total: total, coupon_code: !!coupon ? coupon.code : null })
  
  if(response.success){
    dispatch(finalizeOrder(response));
  }
  
  return response;
}