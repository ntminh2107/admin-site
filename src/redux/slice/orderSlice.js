import { getAllOrderAPI } from "../../services/orderAPI";
import { createAppSlice } from "../appSlice";

const initialState = {
  orderList: [],
  loading: true,
};

export const orderSlice = createAppSlice({
  name: "order",
  initialState,
  reducers: (create) => ({
    getAllOrderThunk: create.asyncThunk(
      async ({ page, pageSize }) => {
        const res = await getAllOrderAPI({ page, pageSize });
        return res;
      },
      {
        pending: (state) => {
          return {
            ...state,
            loading: true,
          };
        },
        fulfilled: (state, action) => {
          const { data, status } = action.payload;
          return {
            ...state,
            loading: false,
            orderList: data,
            status: status,
          };
        },
        rejected: (state) => {
          return {
            ...state,
            loading: false,
          };
        },
      }
    ),
  }),
});

export const { getAllOrderThunk } = orderSlice.actions;
export default orderSlice.reducer;
