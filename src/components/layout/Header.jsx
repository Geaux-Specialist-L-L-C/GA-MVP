import React from "react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-black via-gray-900 to-black text-white z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-8 py-3">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/assets/geaux-logo.png" alt="Geaux Academy Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-white">Geaux Academy</h1>
        </div>

        {/* Navigation Links with Hover Effects */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {["Home", "About Us", "Features", "Curriculum", "Learning Styles", "Contact Us"].map((link, index) => (
            <a 
              key={index} 
              href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative text-white hover:text-yellow-400 transition duration-300 ease-in-out after:block after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Auth Buttons with Smooth Hover Effects */}
        <div className="flex space-x-3">
          <a 
            href="/login" 
            className="px-4 py-2 border border-yellow-500 text-yellow-500 rounded-md transition-transform transform hover:scale-105 hover:bg-yellow-500 hover:text-black duration-300"
          >
            Login
          </a>
          <a 
            href="/signup" 
            className="px-4 py-2 bg-yellow-500 text-black rounded-md transition-transform transform hover:scale-105 hover:bg-yellow-600 duration-300"
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;