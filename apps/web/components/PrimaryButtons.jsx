import Link from "next/link";

function PrimaryButtons({ ButtonText, path }) {
  return (
    <Link
      href={path}
      className="bg-linear-to-br from-black to-gray-700 rounded-2xl text-white h-10 p-2"
    >
      {ButtonText}
    </Link>
  );
}

export default PrimaryButtons;
