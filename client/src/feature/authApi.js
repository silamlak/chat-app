// import axios from "axios";
import axiosInstance, { endpoints } from "../app/api";
import { handleApiError } from "../errorHandller/error.handler";

export const signUp = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.signup, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const signIn = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.signin, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const signOut = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.signOut, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
