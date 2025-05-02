import React from "react";
import { useData } from "../components/data-provider";
import { Check, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar"; // Import Navbar
import Footer from "../components/Footer"; // Import Footer
import "../styles/notifications.css"; // Import the custom CSS file

export default function Notifications() {
  const { notifications, markNotificationAsRead, deleteNotification, loading } = useData();

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
      <Navbar /> {/* Add Navbar */}
      <div className="notifications-container">
        <h1 className="notifications-title">Notifications</h1>
        {notifications.length === 0 ? (
          <p className="no-notifications">You have no notifications.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notification) => (
              <li key={notification.id} className={`notification-item ${notification.read ? "read" : "unread"}`}>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-date">{formatDate(notification.date)}</span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="btn-mark-read"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer /> {/* Add Footer */}
    </>
  );
}