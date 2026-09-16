import { verifyWsToken } from "../../lib/ws-token.js";

function extractTokenFromUrl(url) {
  if (!url) return null;

  const parsed = new URL(url, "http://localhost");
  return parsed.searchParams.get("token");
}

export async function authenticateSocket(request) {
  const token = extractTokenFromUrl(request.url);

  console.log("WS TOKEN PRESENT:", token ? "YES" : "NO");

  if (!token) {
    return null;
  }

  const payload = verifyWsToken(token);

  console.log("WS TOKEN VERIFY:", payload ? "OK" : "FAILED");

  if (!payload) {
    return null;
  }

  return {
    id: Number(payload.id),
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
  };
}