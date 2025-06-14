import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Removed FiShoppingBag import
import React from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Main Navigation */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl text-[#F9D71C]">🍰</span>
            <span className="text-xl font-serif text-[#8B5A2B]">DessertVibe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="font-sans text-[#8B5A2B] hover:text-[#F9D71C] transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="font-sans text-[#8B5A2B] hover:text-[#F9D71C] transition-colors"
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="font-sans text-[#8B5A2B] hover:text-[#F9D71C] transition-colors"
            >
              Our Story
            </Link>
            <Link 
              to="/contact" 
              className="font-sans text-[#8B5A2B] hover:text-[#F9D71C] transition-colors"
            >
              Contact
            </Link>
            {/* Cart icon removed from here */}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#8B5A2B] focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 px-4 text-[#8B5A2B] hover:bg-[#FFF9F0] rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="block py-2 px-4 text-[#8B5A2B] hover:bg-[#FFF9F0] rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="block py-2 px-4 text-[#8B5A2B] hover:bg-[#FFF9F0] rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Story
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 px-4 text-[#8B5A2B] hover:bg-[#FFF9F0] rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {/* Cart link removed from mobile menu too */}
          </div>
        )}
      </div>
    </header>
  );
}