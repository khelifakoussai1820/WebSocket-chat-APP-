import Link from "next/link";

function SecondaryButtons({ ButtonText, path }) {
  return (
    <Link href={path} className="border border-black rounded-2xl  h-10 p-2">
      {ButtonText}
    </Link>
  );
}

export default SecondaryButtons;
