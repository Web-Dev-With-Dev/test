import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full z-20 top-0 left-0 bg-white/80 backdrop-blur shadow-md font-inter">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 tracking-tight select-none">
          Excel Analytics
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-base font-medium">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>
          <Link to="/login" className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 transition font-semibold">Login</Link>
          <Link to="/register" className="text-gray-700 hover:text-indigo-600 transition">Register</Link>
        </div>
        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-indigo-600 mb-1.5 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-indigo-600 mb-1.5 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-indigo-600 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 shadow-lg px-4 pb-4 pt-2 rounded-b-xl animate-fade-in">
          <Link to="/" className="block py-2 text-gray-700 hover:text-indigo-600 transition" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/login" className="block py-2 mt-2 rounded-lg bg-indigo-600 text-white text-center shadow hover:bg-indigo-700 transition font-semibold" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" className="block py-2 text-gray-700 hover:text-indigo-600 transition" onClick={() => setMenuOpen(false)}>Register</Link>
        </div>
      )}
    </nav>
  );
}
