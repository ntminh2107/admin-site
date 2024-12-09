import axiosClient from "./api";

export const getAllOrderAPI = ({ page, pageSize }) => {
  const token = localStorage.getItem("AdminToken");
  return axiosClient
    .get(`api/order/admin/all?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const { data, status } = res;
      return { data, status };
    })
    .catch((err) => err);
};
