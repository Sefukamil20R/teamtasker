import axios from "./axios";

export const sendNotification = async (userId, message) => {
  try {
    const response = await axios.post(
      "/notifications",
      {
        user: userId,
        message,
        read: false,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send notification:", error.response?.data || error.message);
  }
};