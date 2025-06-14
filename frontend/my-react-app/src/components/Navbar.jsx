import { useState } from "react";
import { Link } from "react-router-dom"; // Install react-router-dom if needed
import React from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-playfair text-brand-yellow">🍰</span>
          <span className="text-xl font-playfair text-brand-brown">DessertVibe</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/shop" 
            className="font-lato text-brand-brown hover:text-brand-yellow transition-colors"
          >
            Shop
          </Link>
          <Link 
            to="/contact" 
            className="font-lato text-brand-brown hover:text-brand-yellow transition-colors"
          >
            Contact
          </Link>
          <button className="bg-brand-yellow hover:bg-yellow-600 text-brand-brown font-lato py-2 px-6 rounded-full transition-colors">
            Order Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-brand-brown focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-md">
          <Link 
            to="/shop" 
            className="block py-3 text-brand-brown hover:text-brand-yellow border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Shop
          </Link>
          <Link 
            to="/contact" 
            className="block py-3 text-brand-brown hover:text-brand-yellow"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}