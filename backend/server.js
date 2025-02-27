import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import colors from "colors";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); // Accept JSON data

// Serve uploaded images
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow.bold);
});

// SOCKET.IO SETUP
import { Server } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // console.log("User connected to Socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(`User joined room: ${userData._id}`);
    socket.emit("connected");
  });

  socket.on("typing",(room)=>socket.in(room).emit("typing"));
  socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

  socket.on("join chat" , (room)=>{
    socket.join(room);
    // console.log("User Joined room" + room)
  });

  socket.on("new message",(newMessageRecieved)=>{
   var chat = newMessageRecieved.chat;
   if(!chat.users) return 
  //  console.log("chat.users not defined");
   
   chat.users.forEach(user =>{
    if(user._id === newMessageRecieved.sender._id) return;

    socket.in(user._id).emit("message received",newMessageRecieved)
    })
    socket.off("setup",()=>{{
      // console.log("USER DISCONNECT");
        socket.leave(userData._id)
    }})
  })
});
