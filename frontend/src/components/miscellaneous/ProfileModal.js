import React from "react";
import { AiOutlineClose } from "react-icons/ai"; // Close icon
import "./sideDrawer.css"; // Import styles

const ProfileModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null; // Ensure the modal only renders when needed

  // Set user image (local server or default avatar)
  const imageUrl = user?.pic
    ? user.pic.startsWith("http")
      ? user.pic
      : `http://localhost:5000${user.pic}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-icon" onClick={onClose}>
          <AiOutlineClose size={25} />
        </button>

        {/* Profile Header */}
        <div className="profile-header">
          <h2 className="user-name">{user.name}</h2>
        </div>

        {/* Profile Image */}
        <div className="profile-img-container">
          <img src={imageUrl} alt="Profile" className="profile-pic" />
        </div>

        {/* User Email */}
        <div className="user-email">
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
