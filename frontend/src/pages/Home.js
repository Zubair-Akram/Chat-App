import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/SignUp";
import "../components/Authentication/ChatAuthForm.css";

export default function ChatAuthForm() {
  const [activePage, setActivePage] = useState("login");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
      navigate("/chat"); // ✅ Fixed: Redirects to /chat instead of /chats
    }
  }, [navigate]);

  return (
    <div className="containerH">
      {!user ? (
        <>
          <div className="header-box">Welcome to the Chat App</div>
          <p className="sub-header">Start chatting with your friends</p>
          <div className="button-group-container">
            <button
              className={`button ${
                activePage === "login" ? "active" : "inactive"
              }`}
              onClick={() => setActivePage("login")}
            >
              Login
            </button>
            <button
              className={`button ${
                activePage === "signup" ? "active" : "inactive"
              }`}
              onClick={() => setActivePage("signup")}
            >
              Sign Up
            </button>
          </div>
          <div className="form-container">
            {activePage === "login" ? <Login /> : <Signup />}
          </div>
        </>
      ) : (
        navigate("/chat") // ✅ Fixed redirection
      )}
    </div>
  );
}
