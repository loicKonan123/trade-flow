'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/userUserRole';

const navLinks = [
  { href: '/submit', label: 'Soumettre une stratégie' },
  { href: '/store', label: 'Boutique' },
  { href: '/login', label: 'Connexion' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const { logout } = useAuth();
  const { user, role } = useUserRole();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  const linksToShow = navLinks.filter(link => !(link.href === '/login' && user));

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg ${
        darkMode ? 'bg-white/5 border-b border-white/10' : 'bg-black/5 border-b border-black/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className={`text-3xl font-extrabold bg-gradient-to-r ${
            darkMode ? 'from-violet-500 to-purple-600' : 'from-indigo-500 to-pink-500'
          } text-transparent bg-clip-text tracking-tight`}
        >
          TradeFlow
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex space-x-8 items-center">
          {linksToShow.map(link => (
            <li key={link.href} className="group relative">
              <Link
                href={link.href}
                className={`${
                  darkMode ? 'text-white/80' : 'text-black/80'
                } font-medium text-lg transition-colors hover:text-violet-400`}
              >
                {link.label}
              </Link>
              <span className="block h-0.5 bg-violet-400 absolute left-0 -bottom-1 w-0 group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}

          {/* ADMIN LINKS */}
          {user && role === "admin" && (
            <>
              <li>
                <Link
                  href="/admin"
                  className={`${darkMode ? 'text-white/80' : 'text-black/80'} font-medium text-lg hover:text-violet-400 transition`}
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/product"
                  className={`${darkMode ? 'text-white/80' : 'text-black/80'} font-medium text-lg hover:text-violet-400 transition`}
                >
                  Produits
                </Link>
              </li>
            </>
          )}

          {user && (
            <li>
              <button
                onClick={logout}
                className={`${darkMode ? 'text-white/80' : 'text-black/80'} font-medium text-lg hover:text-violet-400 transition`}
              >
                Déconnexion
              </button>
            </li>
          )}

          <button
            onClick={toggleTheme}
            className={`ml-4 ${darkMode ? 'text-white/80' : 'text-black/80'} hover:text-violet-400 transition`}
          >
            {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>
        </ul>

        {/* MOBILE MENU BUTTON */}
        <button onClick={toggleMenu} className="md:hidden text-white/80 hover:text-violet-400">
          {menuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className={`md:hidden overflow-hidden ${darkMode ? 'bg-black/70' : 'bg-white/70'} backdrop-blur-lg`}
          >
            <ul className="flex flex-col items-center py-4 space-y-4">
              {linksToShow.map(link => (
                <li key={link.href} onClick={() => setMenuOpen(false)}>
                  <Link
                    href={link.href}
                    className={`${
                      darkMode ? 'text-white/80' : 'text-black/80'
                    } font-medium text-lg transition-colors hover:text-violet-400`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {user && role === "admin" && (
                <>
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className={`${darkMode ? 'text-white/80' : 'text-black/80'} font-medium text-lg hover:text-violet-400 transition`}
                    >
                      Admin
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/product"
                      onClick={() => setMenuOpen(false)}
                      className={`${darkMode ? 'text-white/80' : 'text-black/80'} font-medium text-lg hover:text-violet-400 transition`}
                    >
                      Produits
                    </Link>
                  </li>
                </>
              )}

              {user && (
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className={`${darkMode ? 'text-white/80' : 'text-black/80'} font-medium text-lg hover:text-violet-400 transition`}
                  >
                    Déconnexion
                  </button>
                </li>
              )}

              <button
                onClick={toggleTheme}
                className={`${darkMode ? 'text-white/80' : 'text-black/80'} hover:text-violet-400 transition`}
              >
                {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
