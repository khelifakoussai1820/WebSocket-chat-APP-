"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  if (status !== "authenticated") return null;

  const { user } = session;
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  const handleLogout = () => {
    setOpen(false);
    signOut({ callbackUrl: "/signin" });
  };

  const navigateToChat = () => {
    setOpen(false);
    router.push("/chat");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={name}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-black to-gray-700 text-xs font-medium text-white"
      >
        {initials || "U"}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-40 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={navigateToChat}
            className="flex w-full items-center px-4 py-3 text-left text-sm text-black transition-colors hover:bg-gray-50"
          >
            Chat
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center border-t border-gray-100 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}