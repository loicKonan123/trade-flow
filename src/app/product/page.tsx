"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { FaCheckCircle, FaMoneyBillWave, FaLock, FaChartLine } from "react-icons/fa";

export default function ProductPage({ params }: { params: { id: string } }) {
    useRequireAuth();
    const { id } = params;

    // ⚡ Données améliorées avec plus de détails
    const product = {
        title: "Indicateur Breakout Pro",
        description: "Détectez les cassures de niveaux clés avec une précision inégalée grâce à notre algorithme breveté.",
        detailedDescription: [
            "Algorithme exclusif analysant 5 facteurs de confirmation",
            "Alertes visuelles et sonores en temps réel",
            "Compatible avec TradingView, MetaTrader 4/5",
            "Paramètres entièrement personnalisables",
            "Mises à jour gratuites pendant 1 an"
        ],
        mediaType: "image",
        src: "/store/breakout-pro.gif",
        price: "49€",
        originalPrice: "99€",
        discount: "50%",
        rating: 4.8,
        reviews: 124,
        lastUpdated: "Mise à jour: 15/06/2024",
        compatibility: ["TradingView", "MT4", "MT5", "NinjaTrader"],
        features: [
            "Détection des faux breakouts",
            "Filtre de volume intégré",
            "Zones de valeur highlightées",
            "Backtest automatique"
        ]
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 80 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-8"
                >
                    {/* Media Section */}
                    <div className="flex-1">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 aspect-video flex items-center justify-center">
                            {product.mediaType === "image" ? (
                                <img
                                    src={product.src}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <video
                                    src={product.src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-contain"
                                />
                            )}
                            <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm text-white/80">
                                {product.mediaType === "image" ? "GIF Démo" : "Vidéo Démo"}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {product.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                    <span className="text-white/90 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 flex flex-col">
                        {/* Product Header */}
                        <div className="mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                                        {product.title}
                                    </h1>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                        <span className="text-white/60 text-sm">
                                            {product.rating} ({product.reviews} avis)
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-violet-600/20 text-violet-400 px-3 py-1 rounded-full text-sm">
                                    {product.lastUpdated}
                                </div>
                            </div>

                            <p className="text-white/80 mb-6 text-lg">{product.description}</p>
                        </div>

                        {/* Detailed Description */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaChartLine /> Fonctionnalités clés
                            </h3>
                            <ul className="space-y-3">
                                {product.detailedDescription.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-violet-400">▹</span>
                                        <span className="text-white/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Compatibility */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-3">Plateformes compatibles</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.compatibility.map((platform) => (
                                    <span key={platform} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm">
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="mt-auto">
                            <div className="mb-6">
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-bold text-violet-400">{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-white/50 line-through">{product.originalPrice}</span>
                                    )}
                                    {product.discount && (
                                        <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-sm">
                                            Économisez {product.discount}
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/60 text-sm mt-1">Paiement unique - Pas d'abonnement</p>
                            </div>

                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-3"
                                >
                                    <FaLock /> Acheter maintenant
                                </motion.button>

                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                    <FaMoneyBillWave className="text-green-400" />
                                    <span>Garantie satisfait ou remboursé 30 jours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back Link */}
                <div className="mt-10 text-center">
                    <Link
                        href="/store"
                        className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 hover:underline transition"
                    >
                        ← Retour à la boutique
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}