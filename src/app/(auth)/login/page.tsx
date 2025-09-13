"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, resetPassword, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const ok = await signIn(email, password);
    if (ok) {
      console.log("✅ Connexion réussie !");
      router.push("/submit");
    } else {
      console.log("❌ Connexion échouée !");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Veuillez entrer votre email pour réinitialiser le mot de passe.");
      return;
    }
    await resetPassword(email);
    alert("Un email de réinitialisation a été envoyé !");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 pt-20">
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl"
        >
          <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-tight">
            Connexion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input 
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 transition-all duration-200 text-white py-3 rounded-xl font-semibold shadow-xl"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-white/70 hover:text-violet-400 transition-colors"
            >
              Mot de passe oublié ?
            </button>
            <p className="mt-4 text-white/70">
              Pas de compte ?{" "}
              <Link href="/register" className="text-violet-400 hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
