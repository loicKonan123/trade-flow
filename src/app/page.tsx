"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    title: "Breakout Pro",
    description: "Détectez les cassures majeures automatiquement.",
    icon: "📈",
  },
  {
    title: "Oscillateur Dynamique",
    description: "Analyse précise des zones de surachat et survente.",
    icon: "🔍",
  },
  {
    title: "Trend Reversal",
    description: "Anticipez les retournements de tendance clés.",
    icon: "🔄",
  },
  {
    title: "EMA Cloud",
    description: "Combinez plusieurs moyennes mobiles dynamiques.",
    icon: "☁️",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-10 py-16 shadow-2xl mb-16"
        >
          <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
            Automatisez vos stratégies{" "}
            <span className="text-violet-400">TradingView</span>
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Soumettez vos stratégies ou achetez des scripts prêts à l'emploi pour automatiser votre trading.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/submit"
              className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold rounded-xl shadow-xl transition-all duration-200"
            >
              Commencer maintenant
            </Link>
          </motion.div>
        </motion.div>

        {/* ✅ Nouvelle section Cards */}
        <section className="w-full max-w-6xl px-4 pb-20">
          <h3 className="text-3xl font-bold text-white mb-10 text-center">
            Nos Indicateurs & Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl text-left"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
