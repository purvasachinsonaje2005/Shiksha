"use client";

import { IconBrandInstagram, IconMenu3, IconSchool } from "@tabler/icons-react";
import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import { usePathname } from "next/navigation";

// ⭐ import framer-motion
import { motion } from "framer-motion";

export default function () {
  const currentPath = usePathname();

  const links = [
    { name: "About", id: "about" },
    { name: "Features", id: "features" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Contact", id: "contact" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // ⭐ animated navbar wrapper
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`navbar bg-background/80 backdrop-blur-lg border-b border-border Orbitron lg:px-10 text-base-content ${
        currentPath === "/" ? "fixed top-0 left-0 right-0 z-50" : ""
      }`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <IconMenu3 size={24} />
          </div>

          {/* ⭐ animated mobile dropdown menu */}
          <motion.ul
            tabIndex={0}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links.map((link) => (
              <li key={link.name}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(link.id)}
                >
                  {link.name}
                </motion.button>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ⭐ logo with subtle animation */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <Link href="/" className="space-x-3 flex items-center">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <IconSchool size={28} className="text-primary" />
                <span className="font-bold text-lg lg:text-2xl">Shiksha</span>
                <span className="text-sm text-base-content/70 italic hidden lg:block">
                  v1.0
                </span>
              </div>
              <hr className="w-full border border-base-content hidden lg:block" />
              <span className="text-sm text-base-content/70 italic hidden lg:block">
                AI-Powered Student Dropout Prevention System
              </span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* ⭐ animated navbar links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links.map((link) => (
            <li key={link.name}>
              <motion.button
                onClick={() => scrollToSection(link.id)}
                className="text-base font-semibold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <ThemeToggler />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/login" className="btn btn-accent">
            Login
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
