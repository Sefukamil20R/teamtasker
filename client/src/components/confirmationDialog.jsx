import React from "react";
import "../styles/confirmation-dialog.css"; // Add custom styles for the dialog

export default function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onConfirm} className="btn-danger">
            Confirm
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}