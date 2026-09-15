"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Logo from "../logo";
import UserMenu from "../UserMenu";
import PrimaryButtons from "../PrimaryButtons";
import SecondaryButtons from "../SecondaryButtons";

const links = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#feature" },
  { label: "About", href: "#about" },
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NavBar() {
  const { status } = useSession();
  const authenticated = status === "authenticated";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed z-50 w-full bg-gray-100 p-2 font-poppins">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-3 sm:px-6">
        <Logo />

        <ul className="hidden items-center justify-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-gray-700 transition-colors hover:text-black"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          {authenticated ? (
            <UserMenu />
          ) : (
            <>
              <SecondaryButtons ButtonText="Sign in" path="/signin" />
              <PrimaryButtons ButtonText="Get Started" path="/signup" />
            </>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <ul className="mx-3 mt-2 space-y-1 rounded-2xl bg-white p-2 shadow-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}