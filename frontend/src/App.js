import "./App.css";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const user = JSON.parse(localStorage.getItem("userInfo")); // Get user from localStorage

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
        <Route
          path="/chats"
          element={user ? <Chat /> : <Navigate to="/" />}
        />{" "}
        {/* ✅ Added this */}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
