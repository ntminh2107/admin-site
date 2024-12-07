import axiosClient from "./api";

export const getAllOrderAPI = () => {
  const token = localStorage.getItem("token");
  return axiosClient
    .get("/api/order/admin/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const { data, status } = res;
      return { data, status };
    })
    .catch((err) => err);
};
