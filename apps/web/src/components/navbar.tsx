"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { ModeToggle } from "./mode-toggel";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Security", href: "#security" },
  { name: "Team", href: "#team" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-zinc-900/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100">
                MetaStor
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <motion.div
              variants={navVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-1"
            >
              {navItems.map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800/50 transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants} className="ml-4">
                <ModeToggle />
              </motion.div>
              <motion.div variants={itemVariants} className="ml-2">
                <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 hover:scale-105 transform transition-all duration-300">
                  Sign Up
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              <span className="sr-only">Open menu</span>
              <motion.svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </motion.svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-base font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-4 py-4 border-t border-zinc-800">
              <div className="flex items-center space-x-4">
                <ModeToggle />
                <Button className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 hover:scale-105 transform transition-all duration-300">
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
