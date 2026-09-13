import Logo from "../logo";
import PrimaryButtons from "../PrimaryButtons";

const Links = [
  { lien: "Home", path: "home" },
  { lien: "Features", path: "feature" },
  { lien: "About", path: "about" },
];

function NavBar() {
  return (
    <nav className="fixed z-50 w-full bg-gray-100 font-poppins flex items-center justify-around p-2">
      <Logo />

      <ul className=" flex items-center justify-center gap-5 ">
        {Links.map((link, index) => {
          return (
            <li key={index}>
              <a href={`#${link.path}`}>{link.lien}</a>
            </li>
          );
        })}
      </ul>

      <PrimaryButtons ButtonText={"Get Started → "} path={"/"} />
    </nav>
  );
}

export default NavBar;
