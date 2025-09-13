"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 12 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-violet-500 to-purple-600 text-transparent bg-clip-text tracking-tight">
          TradeFlow
        </Link>

        {/* NAV LINKS */}
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link href="/submit" className="relative text-white/80 font-medium hover:text-violet-400 transition">
                Soumettre une stratégie
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="/store" className="relative text-white/80 font-medium hover:text-violet-400 transition">
                Boutique
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="/login" className="relative text-white/80 font-medium hover:text-violet-400 transition">
                Connexion
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
