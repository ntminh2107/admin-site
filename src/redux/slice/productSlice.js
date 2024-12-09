import { createProductAPI, getProductListAPI } from "../../services/productAPI";
import { createAppSlice } from "../appSlice";

const initialState = {
  productList: {},
  product: {},
  loading: true,
};

export const productSlice = createAppSlice({
  name: "product",
  initialState,
  reducers: (create) => ({
    getAllProductsThunk: create.asyncThunk(
      async ({ page, pageSize, sort, search }) => {
        const res = await getProductListAPI({ page, pageSize, sort, search });
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
            productList: data,
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
    createProductThunk: create.asyncThunk(
      async ({
        name,
        image,
        price,
        color,
        category,
        brand,
        specifications,
        percent,
        imagePreview,
      }) => {
        const res = await createProductAPI({
          name,
          image,
          price,
          color,
          category,
          brand,
          specifications,
          percent,
          imagePreview,
        });
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
            product: data,
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
export const { getAllProductsThunk, createProductThunk } = productSlice.actions;
export default productSlice.reducer;
