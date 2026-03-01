const http = require("http"); // RELOAD TRIGGER
const { Server } = require("socket.io");
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  },
});

// Make io accessible globally
global.io = io;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("join-event-chat", ({ eventId, userId, name, role }) => {
    socket.join(`event-chat-${eventId}`);
    socket.data.eventId = eventId;
    socket.data.userId = userId;
    socket.data.name = name;
    socket.data.role = role;
    if (userId) {
      socket.to(`event-chat-${eventId}`).emit("user-joined-chat", { userId, name, role });
    }
    console.log(`Socket ${socket.id} joined event chat: ${eventId}`);
  });

  socket.on("leave-event-chat", (eventId) => {
    socket.leave(`event-chat-${eventId}`);
    if (socket.data.userId) {
      socket.to(`event-chat-${eventId}`).emit("user-left-chat", { userId: socket.data.userId });
    }
    console.log(`Socket ${socket.id} left event chat: ${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
