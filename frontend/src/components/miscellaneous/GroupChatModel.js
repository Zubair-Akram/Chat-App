import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import "./sideDrawer.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import UserListItem from "../UserAvatar/UserListItem"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"

const GroupChatModel = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  // Reset modal state when opening the modal
  const openModal = () => {
    setIsOpen(true);
    setGroupChatName(""); // Reset group name
    setSelectedUsers([]); // Reset selected users
    setSearchResult([]); // Clear search results
    // Do not reset 'search' to keep input populated
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
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
      toast.error("Failed to load Search User", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warning("Please Fill all fields", {
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
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      toast.success("New Group Chat Created!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to Create Group Chat", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleGroup = (userToAdd) => {
    // Ensure the user is not added again
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User Already Added", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    // Don't reset 'search' value when adding a user
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <div>
      {/* Button that opens the modal */}
      <span onClick={openModal}>{children}</span>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Group Chat</h2>

            <input
              type="text"
              placeholder="Group Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="input-field"
            />

            <input
              type="text"
              placeholder="Search Users..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field"
            />
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 3)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}

            <button className="create-btn" onClick={handleSubmit}>
              Create Group
            </button>

            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChatModel;
