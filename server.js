const WebSocket = require("ws");
const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT_WS = 8080;
const PORT_HTTP = 3000;
const IMAGES_DIR = path.join(__dirname, "screenshots");

// Ensure the screenshots directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR);
}

// Start WebSocket server
const wss = new WebSocket.Server({ port: PORT_WS }, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT_WS}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "screenshot") {
        const base64Image = data.data;
        const imageBuffer = Buffer.from(base64Image, "base64");

        // Save the image
        const filePath = path.join(IMAGES_DIR, `screenshot-${Date.now()}.png`);
        fs.writeFileSync(filePath, imageBuffer);
        console.log(`Screenshot saved as ${filePath}`);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start HTTP server
const app = express();

// Endpoint to list all screenshots
app.get("/screenshots", (req, res) => {
  const files = fs.readdirSync(IMAGES_DIR).map((file) => ({
    name: file,
    url: `http://localhost:${PORT_HTTP}/screenshots/${file}`,
  }));
  res.json(files);
});

// Serve screenshot files
app.use("/screenshots", express.static(IMAGES_DIR));

// Start the HTTP server
app.listen(PORT_HTTP, () => {
  console.log(`HTTP server is running on http://localhost:${PORT_HTTP}`);
});
