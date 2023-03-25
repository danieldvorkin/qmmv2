import { login, loginError } from "./manageCart";
import { loginUser } from "./utils/util";

export const URL = "https://queenmarymedical.com/api/v1";

export const loginService = (loginData) => async (dispatch) => {
  try {
    const response = await loginUser(loginData.email, loginData.password);
    
    dispatch(login(response));
  } catch (error) {
    dispatch(loginError((error)));
  }
};