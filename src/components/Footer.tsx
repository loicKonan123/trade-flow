'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full mt-20 py-8 backdrop-blur-lg bg-white/5 border-t border-white/10 text-center"
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} TradeFlow. Tous droits réservés.
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <Link
            href="/privacy"
            className="text-white/60 hover:text-violet-400 transition-colors text-sm"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/terms"
            className="text-white/60 hover:text-violet-400 transition-colors text-sm"
          >
            Conditions d’utilisation
          </Link>
          <Link
            href="/contact"
            className="text-white/60 hover:text-violet-400 transition-colors text-sm"
          >
            Contact
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
