import { createHmac, timingSafeEqual } from "node:crypto";

const ALGORITHM = "sha256";
const TOKEN_TTL_SECONDS = 60 * 5;

function getSecret() {
  return process.env.WS_AUTH_SECRET;
}

export function signWsToken({ id, email, firstName, lastName }) {
  const SECRET = getSecret();

  if (!SECRET) {
    throw new Error("WS_AUTH_SECRET is not set.");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    id: String(id),
    email: email ?? null,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = createHmac(ALGORITHM, SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

export function verifyWsToken(token) {
  const SECRET = getSecret();

  if (!SECRET || typeof token !== "string") {
    return null;
  }

  const [payloadBase64, signature] = token.split(".");

  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = createHmac(ALGORITHM, SECRET)
    .update(payloadBase64)
    .digest("base64url");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  let payload;

  try {
    payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8"),
    );
  } catch {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);

  if (typeof payload.exp !== "number" || payload.exp <= now) {
    return null;
  }

  if (!payload.id) {
    return null;
  }

  return {
    id: String(payload.id),
    email: payload.email ?? null,
    firstName: payload.firstName ?? null,
    lastName: payload.lastName ?? null,
  };
}