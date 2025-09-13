'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Product = {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  src: string;
};

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'products'));
      const data = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((product: any) => product.src && typeof product.src === 'string'); // 🔒 valide src

      setProducts(data as Product[]);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />

      <main className="flex-grow px-4 pt-24 pb-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80 }}
            className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
          >
            Notre Boutique
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
            className="text-white/70 max-w-2xl mx-auto"
          >
            Découvrez nos indicateurs premium pour automatiser votre trading.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
            >
              {/* Media sécurisé */}
              {product.mediaType === 'image' && product.src ? (
                <img
                  src={product.src}
                  alt={product.title}
                  className="w-full h-60 object-cover"
                />
              ) : product.mediaType === 'video' && product.src ? (
                <video
                  src={product.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-60 object-cover"
                />
              ) : (
                <div className="w-full h-60 flex items-center justify-center bg-white/10 text-white/40">
                  Média non disponible
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {product.title}
                </h3>
                <p className="text-white/70 mb-4">{product.description}</p>
                <Link
                  href={`/store/${product.id}`}
                  className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-medium transition"
                >
                  Voir plus
                </Link>
              </div>
            </motion.div>
          ))}

          {products.length === 0 && (
            <p className="text-center text-white/60 col-span-full">
              Aucun produit pour le moment.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
