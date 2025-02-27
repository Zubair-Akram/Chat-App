import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import ScrollableChat from "./ScrollableChat";
import { getSender, getSenderFull } from "../config/ChatLogic";
import axios from "axios";
import "./UserAvatar/MyChats.css";
import io from "socket.io-client";
import Lottie from "lottie-react";
import typingAnimation from "../animations/typing.json"; // ✅ Import typing animation JSON
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =ChatState();
  const [showProfile, setShowProfile] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };

  // ✅ Socket Connection
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [user]);

  // ✅ Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  // ✅ Real-time message receiving
  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification]);
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [selectedChat]);

  // ✅ Fetch messages function
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      // console.error("Error fetching messages:", error);
    }
  };

  // ✅ Send message function
  const sendMessage = async (event) => {
    if (event.key === "Enter" || event.type === "click") {
      if (!newMessage.trim()) return;

      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage("");
        socket.emit("stop typing", selectedChat._id); // Stop typing when message is sent
        setTyping(false);
      } catch (error) {
        toast.error("Error sending message", {
          position: "top-right",
          autoClose: 3000, 
        });
        // console.error("Error sending message:", error);
      }
    }
  };

  // ✅ Typing handler
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {/* Chat Header */}
      <div className="chat-header">
        <button className="back-button" onClick={() => setSelectedChat(null)}>
          &#8592;
        </button>
        <span className="chat-title">
          {!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}
              <span className="eye-icon" onClick={() => setShowProfile(true)}>
                <i className="fa-solid fa-eye"></i>
              </span>
            </>
          ) : (
            <>
              <span className="group-name">
                {selectedChat.chatName.toUpperCase()}
              </span>
              <span
                className="eye-icon"
                onClick={() => setShowGroupModal(true)}
              >
                <i className="fa-solid fa-eye"></i>
              </span>
            </>
          )}
        </span>
      </div>

      {/* Chat Box - Scrollable Messages */}
      <div className="chat-box">
        <ScrollableChat messages={messages} />
      </div>

      {/* Typing Animation */}
      {isTyping && (
        <div className="typing-animation">
          <Lottie
            animationData={typingAnimation}
            loop={true}
            style={{ width: 50, height: 50 }}
          />
        </div>
      )}

      {/* Input Field & Send Button */}
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={typingHandler} // ✅ Fixed function call
          onKeyDown={sendMessage}
        />
        <button className="send-button" onClick={sendMessage}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>

      {/* Modals */}
      {selectedChat.isGroupChat
        ? showGroupModal && (
            <UpdateGroupChatModel
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              setShowGroupModal={setShowGroupModal}
            />
          )
        : showProfile && (
            <ProfileModal
              user={getSenderFull(user, selectedChat.users)}
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
            />
          )}
    </>
  );
};

export default SingleChat;
