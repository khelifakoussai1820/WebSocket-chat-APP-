function Footer() {
  return (
    <footer className="bg-black px-6 py-12 font-poppins text-white sm:px-12 lg:px-44 lg:py-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Gosra.
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Simple conversations. Real connections.
          </p>
        </div>

        <div className="flex gap-16 sm:gap-20">
          <div>
            <h3 className="mb-5 text-sm font-medium text-gray-400">Explore</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#home"
                  className="transition-colors hover:text-gray-400"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="transition-colors hover:text-gray-400"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="transition-colors hover:text-gray-400"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-medium text-gray-400">Connect</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#contact"
                  className="transition-colors hover:text-gray-400"
                >
                  Contact
                </a>
              </li>

              <li>
                <a
                  href="#github"
                  className="transition-colors hover:text-gray-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-800 pt-6">
        <p className="text-sm text-gray-500">
          © 2026 Gosra. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
