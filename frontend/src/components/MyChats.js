import React, { useEffect, useState, useCallback } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../config/ChatLogic";
import "react-toastify/dist/ReactToastify.css";
import "./UserAvatar/MyChats.css"
import GroupChatModel from "./miscellaneous/GroupChatModel.js";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { user, setSelectedChat, selectedChat, chats, setChats } =
    ChatState() || {};

  // Fetch chats using useCallback to prevent unnecessary re-renders
  const fetchChats = useCallback(async () => {
    if (!user?.token) {
      toast.warning("User not authenticated!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);

      toast.success("Chats loaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [user, setChats]);

  useEffect(() => {
    if (user) {
      setLoggedUser(user);
      fetchChats();
    }
  }, [user, fetchChats, fetchAgain]);

  if (!user) {
    return <p className="error-message">Error: Chat Context Not Found</p>;
  }

  return (
    <div className="my-chats-container">
      {/* Header */}
      <div className="chat-header">
        <h2>My Chats</h2>
        <GroupChatModel>
          <button className="new-group-btn">
            <i className="fa-solid fa-plus"></i> New Group Chat
          </button>
        </GroupChatModel>
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${selectedChat === chat ? "selected" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              <p>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </p>
            </div>
          ))
        ) : (
          <p className="no-chats">No chats available.</p>
        )}
      </div>
    </div>
  );
};

export default MyChats;
