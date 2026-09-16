import { getToken } from "next-auth/jwt";

function parseCookies(header) {
  const cookies = {};

  if (!header) return cookies;

  for (const pair of header.split(";")) {
    const separator = pair.indexOf("=");

    if (separator === -1) continue;

    const name = pair.slice(0, separator).trim();
    const rawValue = pair.slice(separator + 1).trim();

    if (!name) continue;

    let value = rawValue;

    try {
      value = decodeURIComponent(rawValue);
    } catch {
      // Keep the raw value when it is not percent-encoded.
    }

    cookies[name] = value;
  }

  return cookies;
}

export async function authenticateSocket(request) {
  const cookieHeader = Array.isArray(request.headers?.cookie)
    ? request.headers.cookie.join("; ")
    : (request.headers?.cookie ?? "");

  console.log("WS COOKIE HEADER:", cookieHeader);
  console.log(
    "WS AUTH SECRET EXISTS:",
    Boolean(process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET),
  );

  const token = await getToken({
    req: {
      cookies: parseCookies(cookieHeader),
      headers: request.headers,
    },
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  console.log("WS TOKEN:", token ? "FOUND" : "NOT FOUND");

  if (!token?.id) {
    return null;
  }

  return {
    id: Number(token.id),
    email: token.email,
    firstName: token.firstName,
    lastName: token.lastName,
  };
}
