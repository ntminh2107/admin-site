import { toast } from "react-toastify";
import axiosClient from "./api";

export const loginAPI = ({ email, password }) => {
  const body = { email, password };
  return axiosClient
    .post("api/auth/login", body)
    .then((res) => {
      const { data, status } = res;
      return { data, status };
    })
    .catch((err) => toast.error("something wrong"));
};

export const getCurrentUserAPI = () => {
  const token = localStorage.getItem("AdminToken");
  return axiosClient
    .get("/api/auth/user/me", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      const { data, status } = res;
      return { data, status };
    })
    .catch((err) => err);
};
