import {
  createMessage,
  findConversationMember,
  touchConversation,
} from "../db.js";

const rooms = new Map();

export async function joinConversation(socket, conversationId) {
  const member = await findConversationMember(conversationId, socket.user.id);

  if (!member) {
    return false;
  }

  if (!rooms.has(conversationId)) {
    rooms.set(conversationId, new Set());
  }

  rooms.get(conversationId).add(socket);

  return true;
}

export function leaveConversation(socket, conversationId) {
  const room = rooms.get(conversationId);

  if (!room) {
    return;
  }

  room.delete(socket);

  if (room.size === 0) {
    rooms.delete(conversationId);
  }
}

export async function sendMessage(socket, conversationId, content) {
  const member = await findConversationMember(conversationId, socket.user.id);

  if (!member) {
    return null;
  }

  const message = await createMessage({
    conversationId,
    senderId: socket.user.id,
    content,
  });

  await touchConversation(conversationId);

  return message;
}

export function broadcastToConversation(conversationId, message) {
  const room = rooms.get(conversationId);

  if (!room) {
    return;
  }

  const payload = JSON.stringify(message);

  for (const socket of room) {
    if (socket.readyState === 1) {
      socket.send(payload);
    }
  }
}

export function removeSocketFromAllRooms(socket) {
  for (const [conversationId, room] of rooms.entries()) {
    room.delete(socket);

    if (room.size === 0) {
      rooms.delete(conversationId);
    }
  }
}