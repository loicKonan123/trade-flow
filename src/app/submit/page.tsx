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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageBase64(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        userEmail: user.email,
        screenshot: imageBase64 || null,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      setIsSubmitted(true);
      setStrategyTitle('');
      setStrategyDescription('');
      setIndicatorsUsed('');
      setImageBase64(null);

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 pt-20">
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="w-full max-w-3xl bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl"
        >
          <motion.div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              Soumettre votre stratégie
            </h2>
            <p className="text-white/80 text-lg">Partagez votre génie avec la communauté TradingView</p>
          </motion.div>

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
              </motion.div>
            ) : (
              <motion.form onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div>
                  <label className="block mb-2 text-white/80">Titre de la stratégie</label>
                  <input type="text" value={strategyTitle} onChange={(e) => setStrategyTitle(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white" required />
                </div>

                <div>
                  <label className="block mb-2 text-white/80">Description</label>
                  <textarea value={strategyDescription} onChange={(e) => setStrategyDescription(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white" rows={4} required />
                </div>

                <div>
                  <label className="block mb-2 text-white/80">Indicateurs utilisés</label>
                  <input type="text" value={indicatorsUsed} onChange={(e) => setIndicatorsUsed(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white" required />
                </div>

                <div>
                  <label className="block mb-2 text-white/80">📷 Capture d’écran de la stratégie (optionnel)</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-white file:bg-violet-600 file:border-0 file:py-2 file:px-4 file:rounded-lg file:text-white file:cursor-pointer" />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white py-4 rounded-xl font-semibold shadow-xl transition">
                  Soumettre la stratégie
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <Link href="/" className="text-violet-400 hover:underline transition">
              ← Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
