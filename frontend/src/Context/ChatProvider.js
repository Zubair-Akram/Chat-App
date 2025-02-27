import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // Get user info from local storage when the app starts
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Function to logout the user
  const logoutUser = () => {
    // Clear user data from state and local storage
    localStorage.removeItem("userInfo");
    setUser(null);
    setChats([]); // Optional: clear the chats as well
    setSelectedChat(null); // Optional: clear selected chat

    // Redirect user to home or login page after logging out
    navigate("/");
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        logoutUser, 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
export default ChatProvider;
 