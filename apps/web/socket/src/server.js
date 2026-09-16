import "dotenv/config";
import { WebSocketServer } from "ws";

import { authenticateSocket } from "./auth.js";
import {
  joinConversation,
  sendMessage,
  broadcastToConversation,
  removeSocketFromAllRooms,
} from "./handlers/messages.js";

const PORT = process.env.PORT || 3001;

const wss = new WebSocketServer({
  host: "0.0.0.0",
  port: PORT,
});

wss.on("connection", async (socket, request) => {
  console.log("WEBSOCKET CONNECTION RECEIVED");
  const user = await authenticateSocket(request);

  if (!user) {
    socket.close(1008, "Unauthorized");
    return;
  }

  socket.user = user;

  console.log(
    `WebSocket connected: ${user.firstName} ${user.lastName} (${user.id})`,
  );

  socket.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to Gosra WebSocket server.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }),
  );

  socket.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "join_conversation") {
        const conversationId = Number(message.conversationId);

        if (!Number.isInteger(conversationId) || conversationId <= 0) {
          return;
        }

        const joined = await joinConversation(socket, conversationId);

        if (!joined) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "You are not a member of this conversation.",
            }),
          );

          return;
        }

        console.log(`User ${user.id} joined conversation ${conversationId}`);

        socket.send(
          JSON.stringify({
            type: "conversation_joined",
            conversationId,
          }),
        );

        return;
      }

      if (message.type === "send_message") {
        const conversationId = Number(message.conversationId);
        const content = message.content?.trim();

        if (!Number.isInteger(conversationId) || conversationId <= 0) {
          return;
        }

        if (!content) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Message content is required.",
            }),
          );

          return;
        }

        const createdMessage = await sendMessage(
          socket,
          conversationId,
          content,
        );

        if (!createdMessage) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "You are not a member of this conversation.",
            }),
          );

          return;
        }

        const outgoingMessage = {
          type: "new_message",
          message: createdMessage,
        };

        broadcastToConversation(conversationId, outgoingMessage);

        return;
      }
    } catch (error) {
      console.error("WEBSOCKET MESSAGE ERROR:", error);

      socket.send(
        JSON.stringify({
          type: "error",
          message: "Something went wrong.",
        }),
      );
    }
  });

  socket.on("close", () => {
    removeSocketFromAllRooms(socket);

    console.log(`WebSocket disconnected: user ${socket.user.id}`);
  });
});

console.log(`Gosra WebSocket server running on ws://localhost:${PORT}`);
