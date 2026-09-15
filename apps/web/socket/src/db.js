import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}

export async function findConversationMember(conversationId, userId) {
  const rows = await query(
    'SELECT id FROM "ConversationMember" WHERE "conversationId" = $1 AND "userId" = $2 LIMIT 1',
    [conversationId, userId],
  );

  return rows[0] ?? null;
}

export async function createMessage({ conversationId, senderId, content }) {
  const [message] = await query(
    'INSERT INTO "Message" ("conversationId", "senderId", "content", "createdAt", "updatedAt") VALUES ($1, $2, $3, now(), now()) RETURNING id, "conversationId", "senderId", content, "createdAt", "updatedAt"',
    [conversationId, senderId, content],
  );

  const [sender] = await query(
    'SELECT id, "firstName", "lastName" FROM "User" WHERE id = $1',
    [senderId],
  );

  return {
    ...message,
    sender: sender ?? null,
  };
}

export async function touchConversation(conversationId) {
  await query('UPDATE "Conversation" SET "updatedAt" = now() WHERE id = $1', [
    conversationId,
  ]);
}