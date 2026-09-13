function Logo({ inverted = false }) {
  return (
    <div>
      <span className="font-poppins px-3.5 py-2 text-center font-bold rounded-full text-white bg-linear-to-br from-black to-gray-700 text-xl">
        G
      </span>
      <span className={`font-poppins text-xl${inverted ? " text-white" : ""}`}> osra </span>
    </div>
  );
}

export default Logo;
