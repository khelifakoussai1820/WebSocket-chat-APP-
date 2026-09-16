"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/logo";
import UserMenu from "@/components/UserMenu";
import useWebSocket from "@/hooks/useWebSocket";

function Avatar({ user }) {
  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xs font-medium text-gray-700">
      {initials || "?"}
    </span>
  );
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

export default function ChatShell() {
  const router = useRouter();
  const searchTimer = useRef(null);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  console.log(
    "[ws:shell] ChatShell render — authenticated =",
    authenticated,
    "loadFriends effect will run",
  );

  const refreshFriends = useCallback(async () => {
    try {
      console.log("[ws:shell] fetching /api/friends…");

      const friendsData = await requestJson("/api/friends");

      console.log("[ws:shell] /api/friends OK — setting authenticated = true");

      setFriends(friendsData.friends || []);
      setRequests(friendsData.requests || []);
      setAuthenticated(true);
    } catch (requestError) {
      console.log("[ws:shell] /api/friends FAILED —", requestError.message);

      if (requestError.message === "Unauthorized") {
        router.replace("/signin");
      } else {
        setError(requestError.message);
      }
    }
  }, [router]);

  useEffect(() => {
    async function loadFriends() {
      try {
        await refreshFriends();
      } catch (requestError) {
        if (requestError.message === "Unauthorized") {
          router.replace("/signin");
        } else {
          setError(requestError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadFriends();
  }, [refreshFriends, router]);

  const handleSocketMessage = useCallback(
    (event) => {
      if (
        event.type === "new_message" &&
        event.message &&
        conversation &&
        event.message.conversationId === conversation.id
      ) {
        setMessages((current) =>
          current.some((message) => message.id === event.message.id)
            ? current
            : [...current, event.message],
        );
      }

      if (
        event.type === "typing" &&
        conversation &&
        event.conversationId === conversation.id &&
        event.userId === selectedFriend?.id
      ) {
        setIsTyping(event.isTyping);
      }

      if (event.type === "error") {
        setError(event.message || "WebSocket error.");
      }
    },
    [conversation, selectedFriend],
  );

  const { status, joinConversation, sendMessage, sendTyping } = useWebSocket({
    enabled: authenticated,
    onMessage: handleSocketMessage,
  });

  console.log("[ws:shell] useWebSocket returned — status =", status);

  useEffect(() => {
    if (conversation && status === "connected") {
      joinConversation(conversation.id);
    }
  }, [conversation, joinConversation, status]);

  const searchUsers = (value) => {
    setSearch(value);
    clearTimeout(searchTimer.current);

    if (!value.trim()) {
      return setUsers([]);
    }

    searchTimer.current = setTimeout(async () => {
      try {
        const data = await requestJson(
          `/api/users/search?q=${encodeURIComponent(value.trim())}`,
        );

        setUsers(data.users || []);
      } catch (requestError) {
        setError(requestError.message);
      }
    }, 250);
  };

  useEffect(() => {
    return () => clearTimeout(searchTimer.current);
  }, []);

  const addFriend = async (receiverId) => {
    try {
      await requestJson("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId }),
      });

      setUsers((current) => current.filter((user) => user.id !== receiverId));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const answerRequest = async (requestId, action) => {
    try {
      await requestJson(`/api/friends/request/${requestId}/${action}`, {
        method: "POST",
      });

      await refreshFriends();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const openFriend = async (friend) => {
    setError("");
    setSelectedFriend(friend);
    setMessages([]);
    setIsTyping(false);

    try {
      const data = await requestJson("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendId: friend.id,
        }),
      });

      setConversation(data.conversation);

      const history = await requestJson(
        `/api/conversations/${data.conversation.id}/messages`,
      );

      setMessages(history.messages || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const submitMessage = (event) => {
    event.preventDefault();

    const content = draft.trim();

    if (!content || !conversation) return;

    if (!sendMessage(conversation.id, content)) {
      setError("WebSocket disconnected. Please try again.");
    } else {
      setDraft("");
      sendTyping(conversation.id, false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-poppins">
      <div className="flex min-h-screen w-full overflow-hidden">
        <aside
          className={`${
            selectedFriend ? "hidden" : "flex"
          } w-full shrink-0 flex-col border-r border-gray-100 sm:flex sm:w-[22rem] lg:w-[25rem]`}
        >
          <div className="flex items-center justify-between px-6 pb-5 pt-7">
            <Logo />

            <div className="flex items-center gap-4">
              <span
                className={`text-xs ${
                  status === "connected" ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {status}
              </span>

              <UserMenu />
            </div>
          </div>

          <div className="px-5">
            <input
              type="search"
              value={search}
              onChange={(event) => searchUsers(event.target.value)}
              placeholder="Search people"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="mt-5 overflow-y-auto px-3 pb-5">
            {error && (
              <p className="mx-3 mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            {search && (
              <section>
                <h2 className="px-3 text-xs font-medium uppercase tracking-[.16em] text-gray-400">
                  People
                </h2>

                <div className="mt-2 space-y-1">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2"
                    >
                      <Avatar user={user} />

                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>

                      <button
                        onClick={() => addFriend(user.id)}
                        className="rounded-lg bg-black px-2 py-1 text-xs text-white"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {requests.length > 0 && (
              <section className="mt-6">
                <h2 className="px-3 text-xs font-medium uppercase tracking-[.16em] text-gray-400">
                  Requests
                </h2>

                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="mt-2 flex items-center gap-2 px-3"
                  >
                    <Avatar user={request.sender} />

                    <span className="min-w-0 flex-1 truncate text-sm">
                      {request.sender.firstName} {request.sender.lastName}
                    </span>

                    <button
                      onClick={() => answerRequest(request.id, "accept")}
                      className="text-xs font-medium"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => answerRequest(request.id, "reject")}
                      className="text-xs text-gray-400"
                    >
                      Decline
                    </button>
                  </div>
                ))}
              </section>
            )}

            <section className="mt-7">
              <div className="flex items-center justify-between px-3">
                <h2 className="text-xs font-medium uppercase tracking-[.16em] text-gray-400">
                  Friends
                </h2>

                <button
                  onClick={refreshFriends}
                  className="text-xs text-gray-400 transition-colors hover:text-black"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-3 space-y-1">
                {loading ? (
                  <p className="px-3 text-sm text-gray-400">Loading…</p>
                ) : (
                  friends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => openFriend(friend)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${
                        selectedFriend?.id === friend.id
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <Avatar user={friend} />

                      <span className="truncate text-sm font-medium">
                        {friend.firstName} {friend.lastName}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </section>
          </div>
        </aside>

        <section
          className={`${
            selectedFriend ? "flex" : "hidden"
          } flex-1 flex-col bg-white sm:flex`}
        >
          {selectedFriend ? (
            <>
              <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-5 sm:px-8">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFriend(null);
                    setIsTyping(false);
                  }}
                  aria-label="Back to friends"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg leading-none sm:hidden"
                >
                  ‹
                </button>

                <Avatar user={selectedFriend} />

                <div>
                  <h1 className="font-medium">
                    {selectedFriend.firstName} {selectedFriend.lastName}
                  </h1>

                  <p className="text-xs text-gray-400">
                    {isTyping
                      ? "typing..."
                      : status === "connected"
                        ? "Connected"
                        : "Connecting…"}
                  </p>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-8">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === selectedFriend.id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <p
                      className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
                        message.senderId === selectedFriend.id
                          ? "bg-gray-100"
                          : "bg-black text-white"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              <form
                onSubmit={submitMessage}
                className="flex gap-3 border-t border-gray-100 p-5"
              >
                <input
                  value={draft}
                  onChange={(event) => {
                    const value = event.target.value;

                    setDraft(value);

                    if (conversation) {
                      sendTyping(conversation.id, value.length > 0);
                    }
                  }}
                  placeholder="Write a message"
                  className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none"
                />

                <button className="rounded-xl bg-black px-5 text-sm text-white">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="m-auto text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-2xl">
                G
              </div>

              <h1 className="mt-6 text-2xl font-medium">
                Your conversations, in one place.
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                Choose a friend to start chatting.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
