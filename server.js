const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://screenshot-backend-ydau.onrender.com", // Adjust as needed for production
    methods: ["GET", "POST"],
  },
});

// Handle connection events
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Listen for screenshot events
  socket.on("screenshot", (data) => {
    console.log("Received screenshot:", data);
    // Broadcast the screenshot to all other clients
    socket.broadcast.emit("view_screenshot", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
