import React from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import "./UserAvatar/MyChats.css";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`chat-box-container ${
        selectedChat ? "show" : "hide-on-mobile"
      }`}
    >
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <div className="empty-chat-message">
          <p>Click on a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
