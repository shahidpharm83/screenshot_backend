const WebSocket = require("ws");
const PORT = process.env.PORT || 443;

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(
    `WebSocket server is running on wss://screenshot-backend-ydau.onrender.com:${PORT}`
  );
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Echo the message back to the client (or handle it as needed)
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
