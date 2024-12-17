const WebSocket = require("ws");

const PORT_WS = 8080;

const wss = new WebSocket.Server({ port: PORT_WS }, () => {
  console.log(
    `WebSocket server is running on wss://screenshot-backend-ydau.onrender.com:${PORT_WS}`
  );
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "screenshot") {
        // Broadcast the screenshot to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
