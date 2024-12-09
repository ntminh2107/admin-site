import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import orderReducer from "./slice/orderSlice";
import productReducer from "./slice/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    product: productReducer,
  },
});

export const useAppDispatch = () => useAppDispatch();
