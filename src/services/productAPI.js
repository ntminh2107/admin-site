import axiosClient from "./api";

export const getProductListAPI = ({ page, pageSize, sort, search }) => {
  return axiosClient
    .get(
      `api/product?page=${page || 1}&pageSize=${pageSize || 5}&sortOrder=${
        sort || "asc"
      }&search=${search}`
    )
    .then((res) => {
      const { data, status } = res;
      return { data, status };
    })
    .catch((err) => err);
};

export const createProductAPI = ({
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
  const body = {
    name,
    image,
    price,
    color,
    category,
    brand,
    specifications,
    percent,
    imagePreview,
  };
  const token = localStorage.getItem("AdminToken");
  return axiosClient
    .post(`api/product/add`, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const { data, status } = res;
      return { data, status };
    })
    .catch((err) => err);
};

export const getProductDetailAPI = (productID) => {
  return axiosClient
    .get(`api/product/detail/${productID}`)
    .then((res) => {
      const { data, status } = res;
      return { data, status };
    })
    .catch((err) => err);
};
