import axiosInstance, { endpoints } from '../../app/api'
import {handleApiError} from '../../errorHandller/error.handler.js'

export const getUsers = async () => {
    try {
        const res = await axiosInstance.get(endpoints.users, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const getMessages = async (userId) => {
    try {
        const res = await axiosInstance.get(`${endpoints.messages}/${userId}`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const sendMessage = async (conversationId, text) => {
  const body = {
    text,
  }
  try {
    const res = await axiosInstance.post(
      `${endpoints.send_messages}/${conversationId}`,
      body, 
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

