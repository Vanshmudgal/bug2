import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#8B5A2B] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl text-[#F9D71C]">🍰</span>
            <span className="text-xl font-serif">DessertVibe</span>
          </div>
          <p className="font-sans text-[#FFF9F0] max-w-md">
            Crafting nostalgic vegan desserts with modern flair. Made by chefs, loved by you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-lg mb-4 text-[#F9D71C]">Explore</h4>
          <ul className="space-y-2 font-sans">
            <li>
              <Link to="/" className="text-[#FFF9F0] hover:text-[#F9D71C] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-[#FFF9F0] hover:text-[#F9D71C] transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-[#FFF9F0] hover:text-[#F9D71C] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social/Contact */}
        <div>
          <h4 className="font-serif text-lg mb-4 text-[#F9D71C]">Connect</h4>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="text-[#FFF9F0] hover:text-[#F9D71C] transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="text-[#FFF9F0] hover:text-[#F9D71C] transition-colors">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="text-[#FFF9F0] hover:text-[#F9D71C] transition-colors">
              <FaTwitter className="text-xl" />
            </a>
          </div>
          <p className="font-sans text-sm text-[#FFF9F0]">
            ✉️ hello@dessertvibe.com<br />
            📞 +1 (555) 123-4567
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-[#F9D71C]/20">
        <p className="font-sans text-center text-[#FFF9F0]/80 text-sm">
          © {new Date().getFullYear()} DessertVibe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}