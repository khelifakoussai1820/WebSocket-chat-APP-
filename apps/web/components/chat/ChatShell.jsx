import Logo from "@/components/logo";

const friends = [
  { name: "Maya Chen", status: "Online", initials: "MC", color: "bg-rose-100 text-rose-700" },
  { name: "Elias Martin", status: "Last seen 12m ago", initials: "EM", color: "bg-sky-100 text-sky-700" },
  { name: "Noor Ahmed", status: "Online", initials: "NA", color: "bg-amber-100 text-amber-700" },
];

const groups = [
  { name: "Design circle", members: "8 members", initials: "DC" },
  { name: "Weekend plans", members: "5 members", initials: "WP" },
];

function Avatar({ initials, color = "bg-gray-100 text-gray-700" }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-medium ${color}`}
    >
      {initials}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatShell() {
  return (
    <main className="min-h-screen bg-white font-poppins">
      <div className="flex min-h-screen w-full overflow-hidden bg-white">
        <aside className="flex w-full shrink-0 flex-col border-r border-gray-100 sm:w-[22rem] lg:w-[25rem]">
          <div className="flex items-center justify-between px-6 pb-5 pt-7">
            <Logo />
            <button
              type="button"
              aria-label="Start a new conversation"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-xl font-light text-white transition hover:bg-gray-800"
            >
              +
            </button>
          </div>

          <div className="px-5">
            <label className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 text-gray-400">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search conversations"
                className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
              />
            </label>
          </div>

          <div className="mt-7 overflow-y-auto px-3 pb-5">
            <section aria-labelledby="friends-heading">
              <h2 id="friends-heading" className="px-3 text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                Friends
              </h2>
              <div className="mt-3 space-y-1">
                {friends.map((friend) => (
                  <button key={friend.name} type="button" className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-gray-50">
                    <Avatar initials={friend.initials} color={friend.color} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-black">{friend.name}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                        {friend.status === "Online" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                        {friend.status}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="groups-heading" className="mt-8">
              <h2 id="groups-heading" className="px-3 text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                Groups
              </h2>
              <div className="mt-3 space-y-1">
                {groups.map((group) => (
                  <button key={group.name} type="button" className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-gray-50">
                    <Avatar initials={group.initials} color="bg-gray-900 text-white" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-black">{group.name}</span>
                      <span className="block text-xs text-gray-400">{group.members}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        <section className="hidden flex-1 flex-col items-center justify-center bg-white px-8 text-center sm:flex">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-2xl text-gray-700">G</div>
          <h1 className="mt-6 text-2xl font-medium tracking-tight text-black">Your conversations, in one place.</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">Choose a friend or group from the sidebar to start chatting.</p>
        </section>
      </div>
    </main>
  );
}
