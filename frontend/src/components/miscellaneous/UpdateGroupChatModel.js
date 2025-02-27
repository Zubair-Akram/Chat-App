import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { toast } from "react-toastify";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import "react-toastify/dist/ReactToastify.css";
import "./groupChat.css";

const UpdateGroupChatModel = ({
  fetchAgain,
  setFetchAgain,
  setShowGroupModal,
}) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGroupChatName(selectedChat.chatName);
    setSelectedUsers(selectedChat.users);
  }, [selectedChat]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load Search Users", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleRenameGroup = async () => {
    if (!groupChatName) {
      toast.warning("Group name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      toast.success("Group name updated!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowGroupModal(false);
    } catch (error) {
      toast.error("Failed to update group name", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleAddUser = async (userToAdd) => {
    // Check if the user is already in the selectedUsers list
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast.error("User already added", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );

      setSelectedChat(data); // Update the selectedChat with new user added
      setFetchAgain(!fetchAgain);
      toast.success("User added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowGroupModal(false); // Close the modal after adding a user
    } catch (error) {
      toast.error("Failed to add user", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("User removed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to remove user", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/leavegroup",
        { chatId: selectedChat._id },
        config
      );

      setSelectedChat(null);
      setShowGroupModal(false);
      toast.success("You left the group", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to leave the group", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Title of Modal */}
        <h2>Update Group Chat</h2>

        {/* Existing Users as UserBadgeItem */}
        <div className="user-badge-container">
          {selectedChat.users.map((user) => (
            <UserBadgeItem
              key={user._id}
              user={user}
              handleFunction={() => handleRemoveUser(user)}
            />
          ))}
        </div>

        {/* Update Group Name Input and Button */}
        <div style={{ display: "flex", width: "100%" }}>
          <input
            type="text"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            placeholder="Enter Group Name"
            className="input-field"
          />
          <button onClick={handleRenameGroup} className="update-btn">
            Update
          </button>
        </div>

        {/* Search User to Add Input */}
        <input
          type="text"
          placeholder="Search Users to Add"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />

        {/* Display Search Results */}
        <div className="search-result">
          {loading ? (
            <div>Loading...</div>
          ) : (
            searchResult.map((user) => (
              <div className="user-item" key={user._id}>
                <span>{user.name}</span>
                <button onClick={() => handleAddUser(user)}>Add</button>
              </div>
            ))
          )}
        </div>

        {/* Leave Button */}
        <button onClick={handleLeaveGroup} className="leave-btn">
          Leave Group
        </button>

        {/* Close Button */}
        <button onClick={() => setShowGroupModal(false)} className="close-btn">
          ✖
        </button>
      </div>
    </div>
  );
};

export default UpdateGroupChatModel;
