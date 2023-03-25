import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./manageCart";
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

export default configureStore({
  reducer: persistedReducer,
  middleware: [thunkMiddleware]
});
