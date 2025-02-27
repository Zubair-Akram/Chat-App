import React from "react";
import "./MyChats.css"; // Import CSS file


const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div className="user-badge" onClick={handleFunction}>
      {user.name}
      <div className="close">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
  );
};

export default UserBadgeItem;
