import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useEffect, useState } from "react";

const Chat = () => {
  const { user, selectedChat } = ChatState();
  const [fetchAgain,setFetchAgain] = useState(false)

  useEffect(() => {
    // console.log("Selected Chat Updated:", selectedChat);
  }, [selectedChat]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          minHeight: "100vh",
          padding: "10px",
        }}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain}  />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default Chat;
