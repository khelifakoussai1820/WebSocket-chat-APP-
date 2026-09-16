"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL;

export default function useWebSocket({ enabled, onMessage }) {
  const socketRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const [status, setStatus] = useState("disconnected");

  console.log("[ws:hook] useWebSocket() CALLED — enabled =", enabled);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    console.log("[ws:hook] effect RAN — enabled =", enabled);
    if (!enabled) {
      console.log(
        "[ws:hook] enabled is false → SKIPPING connection (no WebSocket created)",
      );
      return undefined;
    }

    let cancelled = false;

    async function connect() {
      try {
        console.log("[ws:hook] fetching /api/ws-token…");
        const response = await fetch("/api/ws-token");
        const data = await response.json();

        if (!response.ok || !data?.token) {
          throw new Error(data?.error || "Failed to obtain WebSocket token.");
        }

        if (cancelled) return;

        const url = `${SOCKET_URL}?token=${encodeURIComponent(data.token)}`;

        console.log("[ws:hook] creating WebSocket →", SOCKET_URL);
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("[ws:hook] socket OPEN");
          setStatus("connected");
        };
        socket.onmessage = (event) => {
          console.log("[ws:hook] MESSAGE RECEIVED:", event.data);
          try {
            onMessageRef.current?.(JSON.parse(event.data));
          } catch {
            // Ignore malformed messages so the connection remains usable.
          }
        };
        socket.onerror = (event) => {
          console.log("[ws:hook] socket ERROR", event.message ?? event);
          setStatus("error");
        };
        socket.onclose = (event) => {
          console.log(
            "[ws:hook] socket CLOSE — code =",
            event.code,
            "reason =",
            event.reason,
          );
          setStatus("disconnected");
        };
      } catch (error) {
        if (cancelled) return;
        console.log(
          "[ws:hook] connection setup FAILED —",
          error.message ?? error,
        );
        setStatus("error");
      }
    }

    connect();

    return () => {
      cancelled = true;
      console.log("[ws:hook] effect CLEANUP — closing socket");
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [enabled]);

  const send = useCallback((payload) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) return false;
    socketRef.current.send(JSON.stringify(payload));
    return true;
  }, []);

  const joinConversation = useCallback(
    (conversationId) => send({ type: "join_conversation", conversationId }),
    [send],
  );

  const sendMessage = useCallback(
    (conversationId, content) =>
      send({ type: "send_message", conversationId, content }),
    [send],
  );

  return { status, joinConversation, sendMessage };
}
