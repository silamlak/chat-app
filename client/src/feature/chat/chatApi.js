import axiosInstance, { endpoints } from "../../app/api";
import { handleApiError } from "../../errorHandller/error.handler.js";

export const getconversations = async () => {
  try {
    const res = await axiosInstance.get(endpoints.conversations, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMessages = async (userId) => {
  try {
    const res = await axiosInstance.get(`${endpoints.messages}/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const sendMessage = async (conversationId, data) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.send_messages}/${conversationId}`,
      data,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getNewUsers = async () => {
  try {
    const res = await axiosInstance.get(endpoints.new_users, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateReadMessage = async (ids) => {
  try {
    console.log(ids)
    const { conversationId, messageId } = ids;
    const res = await axiosInstance.put(
      `${endpoints.read_message}/${conversationId}/${messageId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
