import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isLastMessage } from "../config/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import "./UserAvatar/MyChats.css";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed className="scrollable-chat">
      {messages.map((m, i) => (
        <div
          key={m._id}
          className={`message-container ${
            m.sender._id === user._id ? "sent" : "received"
          }`}
        >
          {/* Profile Picture only for the last message of a sender */}
          {isSameSender(messages, m, i, user._id) ||
          isLastMessage(messages, i, user._id) ? (
            <img
              src={m.sender.pic}
              alt={m.sender.name}
              className="sender-pic"
              title={m.sender.name} // Tooltip on hover
            />
          ) : (
            <div className="empty-space"></div> // Keeps all messages aligned
          )}

          <div className="message-bubble">{m.content}</div>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
