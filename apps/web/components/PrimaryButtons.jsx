import Link from "next/link";

function PrimaryButtons({ ButtonText, path }) {
  return (
    <Link
      href={path}
      className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-2xl bg-linear-to-br from-black to-gray-700 px-3 text-sm font-medium text-white transition hover:opacity-90 sm:px-4"
    >
      {ButtonText}
    </Link>
  );
}

export default PrimaryButtons;
