import { toast } from "react-hot-toast";

export const handleApiError = (error) => {
  let errorMessage = "An unexpected error occurred. Please try again later.";

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("API Error Response:", error.response.data);
    errorMessage =
      error.response.data.error ||
      "An error occurred while processing your request.";
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API Error Request:", error.request);
    errorMessage =
      "No response received from the server. Please try again later.";
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("API Error Message:", error.message);
    errorMessage =
      error.message || "An unexpected error occurred. Please try again later.";
  }

  // Display the error message using toast notification
  toast.error(errorMessage);

  return {
    status: error.response ? error.response.status : 500,
    message: errorMessage,
  };
};
