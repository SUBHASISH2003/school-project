"use client";

import { useState } from "react";
import Link from "next/link";
import { School, PlusCircle, List, Home, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/addSchool", label: "Add School", icon: <PlusCircle className="w-5 h-5" /> },
    { href: "/showSchools", label: "Show Schools", icon: <List className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md border-b border-purple-500/30 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-amber-300 font-bold text-xl">
          <School className="w-6 h-6" /> SchoolApp
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === link.href
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-purple-500/40"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="fixed top-0 left-0 h-full w-64 bg-purple-950/95 backdrop-blur-xl shadow-2xl border-r border-purple-700/30 z-40"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-purple-700/30">
              <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <School className="w-5 h-5" /> SchoolApp
              </h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col px-6 py-6 gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    pathname === link.href
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/40"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  );
}
