import { finalizeOrder, login, loginError } from "./manageCart";
import { loginUser, submitOrder } from "./utils/util";

export const URL = "https://queenmarymedical.herokuapp.com/api/v1";

export const loginService = (loginData) => async (dispatch) => {
  try {
    const response = await loginUser(loginData.email, loginData.password);
    
    dispatch(login(response));
  } catch (error) {
    dispatch(loginError((error)));
  }
};

export const submitNewOrder = (order) => async (dispatch) => {
  const response = await submitOrder(order)
  dispatch(finalizeOrder(response));

  return response;
}