import axios from "axios";
import {store} from "../app/store";
import { setUser } from "../feature/authSlice";
import { logout } from "../feature/authSlice";
const api = "http://localhost:5500/api/v1";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500/api/v1",
});

// Request interceptor to add auth token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.user
    // console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:5500/api/v1/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        // console.log(response.data);
        const newAccessToken = response?.data?.token;
        store.dispatch(setUser(newAccessToken));
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        console.error("Refresh token failed", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const endpoints = {
  signin: `/auth/sign-in`,
  signup: `${api}/auth/sign-up`,
  signOut: `${api}/auth/sign-out`,
  confirm: `${api}/auth/confirm-otp`,
  request_reset: `${api}/auth/request/reset`,
  reset_password: `${api}/auth/reset`,

  //chat
  users: `/chat/users`,
  messages: `/chat/get-messages`,
  send_messages: `/chat/create-messages`,
};
