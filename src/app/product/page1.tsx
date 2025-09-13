"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProductPage({ params }: { params: { id: string } }) {
    useRequireAuth();
  // 🔑 Exemple : Tu peux fetch ici tes data depuis Firebase / Firestore
  const { id } = params;

  // ⚡ Pour la démo, on simule les données
  const product = {
    title: "Indicateur Breakout Pro",
    description:
      "Cet indicateur détecte les cassures de niveaux clés pour anticiper les mouvements importants du marché. Idéal pour le scalping ou le swing trading.",
    mediaType: "image", // ou "video"
    src: "/store/breakout-pro.gif",
    price: "49€",
  };
  // test
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8"
        >
          {/* Media */}
          <div className="flex-1">
            {product.mediaType === "image" && (
              <img
                src={product.src}
                alt={product.title}
                className="w-full rounded-2xl object-cover"
              />
            )}
            {product.mediaType === "video" && (
              <video
                src={product.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-2xl object-cover"
              ></video>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {product.title}
              </h1>
              <p className="text-white/70 mb-6">{product.description}</p>
              <p className="text-2xl text-violet-400 font-bold mb-6">{product.price}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold transition-all shadow-lg"
            >
              Ajouter au panier
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            href="/store"
            className="text-violet-400 hover:underline transition"
          >
            ← Retour à la boutique
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
