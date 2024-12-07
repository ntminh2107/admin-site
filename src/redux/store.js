import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import orderReducer from "./slice/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
  },
});

export const useAppDispatch = () => useAppDispatch();
