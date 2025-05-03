import React, { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "../utils/axios";
import "../styles/notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`, { read: true }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error.response?.data || error.message);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error.response?.data || error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="notifications-container">
        <h1 className="notifications-title">Notifications</h1>
        {notifications.length === 0 ? (
          <p className="no-notifications">You have no notifications.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notification) => (
              <li key={notification._id} className={`notification-item ${notification.read ? "read" : "unread"}`}>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-date">{formatDate(notification.createdAt)}</span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="btn-mark-read"
                      onClick={() => markNotificationAsRead(notification._id)}
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => deleteNotification(notification._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}