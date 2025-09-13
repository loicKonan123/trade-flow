'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { db, auth } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SubmitStrategy() {
  useRequireAuth();

  const [user] = useAuthState(auth);

  const [strategyTitle, setStrategyTitle] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [indicatorsUsed, setIndicatorsUsed] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour soumettre une stratégie.");
      return;
    }

    try {
      await addDoc(collection(db, "scripts"), {
        title: strategyTitle,
        description: strategyDescription,
        indicators: indicatorsUsed.split(',').map((s) => s.trim()),
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      setIsSubmitted(true);
      setStrategyTitle('');
      setStrategyDescription('');
      setIndicatorsUsed('');

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 pt-20">
      {/* NAVBAR FIXED */}
      <Navbar />

      {/* CONTENT */}
      <main className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="w-full max-w-3xl bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl"
        >
          {/* TITLE */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              Soumettre votre stratégie
            </h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-lg"
            >
              Partagez votre génie avec la communauté TradingView
            </motion.p>
          </motion.div>

          {/* SUCCESS */}
          <AnimatePresence>
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-6 rounded-xl mb-6 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-2">Succès !</h3>
                <p>Votre stratégie a été soumise avec succès.</p>
                <motion.div 
                  className="w-full bg-white/20 h-1 mt-4 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Title */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label htmlFor="title" className="block text-left mb-2 font-medium text-white/80">Titre de la stratégie</label>
                  <input
                    id="title"
                    type="text"
                    value={strategyTitle}
                    onChange={(e) => setStrategyTitle(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    placeholder="Ex: RSI Divergence"
                    required
                  />
                </motion.div>

                {/* Description */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label htmlFor="description" className="block text-left mb-2 font-medium text-white/80">Description</label>
                  <textarea
                    id="description"
                    value={strategyDescription}
                    onChange={(e) => setStrategyDescription(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    rows={4}
                    placeholder="Décrivez votre stratégie..."
                    required
                  ></textarea>
                </motion.div>

                {/* Indicators */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label htmlFor="indicators" className="block text-left mb-2 font-medium text-white/80">Indicateurs utilisés</label>
                  <input
                    id="indicators"
                    type="text"
                    value={indicatorsUsed}
                    onChange={(e) => setIndicatorsUsed(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    placeholder="RSI, MACD, Bollinger Bands"
                    required
                  />
                  <p className="text-sm text-white/50 mt-2">Séparez les indicateurs par des virgules</p>
                </motion.div>

                {/* SUBMIT BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 transition-all duration-200 text-white py-4 rounded-xl font-semibold shadow-xl"
                >
                  Soumettre la stratégie
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* BACK LINK */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-violet-400 hover:underline transition">
              ← Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
