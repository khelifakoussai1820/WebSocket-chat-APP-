import { WebSocket, WebSocketServer } from "ws";

const PORT = 3001;

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to gosra WebSocket server",
    }),
  );

  socket.on("message", (data) => {
    console.log("Received", data.toString());
  });

  socket.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

console.log(`Gosra WebSocket server running on ws://localhost:${PORT}`);
