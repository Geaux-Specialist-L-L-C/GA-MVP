import React from "react";
import "./styles/Header.css";

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="flex items-center">
          <img src="/assets/geaux-logo.png" alt="Geaux Academy" className="h-14 w-auto" />
          <h1 className="text-2xl font-bold ml-4 text-primary">Geaux Academy</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li className="text-textLight hover:text-primary">Home</li>
            <li className="text-textLight hover:text-primary">Features</li>
            <li className="text-textLight hover:text-primary">About</li>
            <li className="text-textLight hover:text-primary">Contact</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;