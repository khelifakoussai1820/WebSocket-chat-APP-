import Link from "next/link";

function SecondaryButtons({ ButtonText, path }) {
  return (
    <Link
      href={path}
      className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-2xl border border-black px-3 text-sm font-medium transition hover:bg-black hover:text-white sm:px-4"
    >
      {ButtonText}
    </Link>
  );
}

export default SecondaryButtons;
