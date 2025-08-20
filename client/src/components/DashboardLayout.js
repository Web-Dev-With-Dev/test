import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowUpTrayIcon, ClockIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/admin", label: "Admin" },
];

const sidebarLinks = [
  { to: "/dashboard/upload", icon: ArrowUpTrayIcon, label: "Upload" },
  { to: "/dashboard/history", icon: ClockIcon, label: "History" },
];

export default function DashboardLayout({ children }) {
  const nav = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#b3b8f7] font-inter flex flex-col">
      {/* Navbar */}
      {isLoggedIn && (
        <nav className="fixed top-0 left-0 w-full z-30 bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#b3b8f7] shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <span className="text-2xl font-extrabold text-white tracking-tight select-none">
              Excel Analytics
            </span>
            <div className="flex space-x-6 text-base font-medium">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-white/90 hover:text-white transition border-b-2 border-transparent hover:border-white pb-1 ${location.pathname === link.to ? 'font-bold border-white' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-white/90 hover:text-white px-3 py-1 rounded transition border-b-2 border-transparent hover:border-white focus:outline-none"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" /> Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Layout: Sidebar + Main */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        {isLoggedIn && (
          <aside className="sticky top-16 h-[calc(100vh-4rem)] w-16 bg-white/80 shadow-lg flex flex-col items-center py-6 space-y-6 z-20">
            {sidebarLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`group flex flex-col items-center justify-center w-12 h-12 rounded-lg hover:bg-indigo-100 transition relative ${location.pathname === to ? 'bg-indigo-100' : ''}`}
              >
                <Icon className="h-6 w-6 text-indigo-600" />
                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
                  {label}
                </span>
              </Link>
            ))}
          </aside>
        )}
        {/* Main Content */}
        <main className="flex-1 px-4 py-8 md:px-10 bg-transparent min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
} 