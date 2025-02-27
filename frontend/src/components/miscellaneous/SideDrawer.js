import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { toast } from "react-toastify";
import UserListItem from "../UserAvatar/UserListItem";
import "react-toastify/dist/ReactToastify.css";
import "./sideDrawer.css";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, logoutUser, setSelectedChat, chats, setChats } = ChatState();

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
  };

  // Handle Search
  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter something in search!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );

      // console.log("Search Results:", data); // Debugging
      setSearchResults(data);
    } catch (error) {
      // console.error("Search error:", error);
      toast.error("An error occurred while searching!", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setLoading(false);
  };

  // Handle opening a chat
  const accessChat = async (userId) => {
    // console.log("Clicked User ID:", userId); // Debugging
    if (!userId) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chat",
        { userId },
        config
      );

      // console.log("Chat Data Received:", data); // Debugging

      if (!chats?.find((c) => c._id === data._id)) {
        setChats([data, ...(chats || [])]); // Ensure chats is always defined
      }

      setSelectedChat(data);
      setIsDrawerOpen(false); // Close the drawer
    } catch (error) {
      // console.error("Error accessing chat:", error);
      toast.error("Failed to open chat!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className="side-drawer">
        <div className="search-container">
          <i
            className="fas fa-search"
            onClick={() => setIsDrawerOpen(true)}
          ></i>
        </div>

        <h1 className="title">Talk-A-Tive</h1>

        <div className="right-container">
          <div className="user-menu">
            <div className="profile-box" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="profile-icon">
                <i className="fa-solid fa-user"></i>
              </div>
              <i className="fa-solid fa-caret-down"></i>
            </div>

            <div className={`profile-dropdown ${menuOpen ? "active" : ""}`}>
              <ul>
                <li onClick={() => setIsModalOpen(true)}>
                  <i className="fa-solid fa-user"></i> My Profile
                </li>
                <li className="dropdown-divider"></li>
                <li onClick={handleLogout}>
                  <i className="fa-solid fa-sign-out-alt"></i> Log Out
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={`search-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-content">
          <div className="drawer-header">
            <h2>Search Users</h2>
            <button
              className="close-drawer"
              onClick={() => setIsDrawerOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="search-row">
            <input
              type="text"
              placeholder="Search by email or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="go-btn"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : "Go"}
            </button>
          </div>

          <div className="search-results">
            {loading ? (
              <p className="loading-text">Loading users...</p>
            ) : (
              searchResults.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default SideDrawer;
