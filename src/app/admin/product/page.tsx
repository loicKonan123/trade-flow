'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserRole } from '@/hooks/userUserRole';

export default function AdminProduits() {
  const { user, role } = useUserRole();
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    rating: '',
    reviews: '',
    compatibility: '',
    detailedDescription: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === null) return; // en attente du rôle
    if (!user || role !== 'admin') {
      window.location.href = '/';
    } else {
      fetchProducts();
    }
  }, [user, role]);

  const fetchProducts = async () => {
    const q = await getDocs(collection(db, 'products'));
    setProducts(q.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      id: '', title: '', description: '', price: '',
      originalPrice: '', discount: '', rating: '',
      reviews: '', compatibility: '', detailedDescription: '',
    });
    setMediaFile(null);
    setDocFile(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      let mediaUrl = form.id ? form.mediaUrl : '';
      let docUrl = form.id ? form.docUrl : '';

      if (mediaFile) {
        const mRef = ref(storage, `products/media-${Date.now()}-${mediaFile.name}`);
        const snap = await uploadBytes(mRef, mediaFile);
        mediaUrl = await getDownloadURL(snap.ref);
      }
      if (docFile) {
        const dRef = ref(storage, `products/docs-${Date.now()}-${docFile.name}`);
        const snap = await uploadBytes(dRef, docFile);
        docUrl = await getDownloadURL(snap.ref);
      }

      const payload: any = {
        title: form.title || '',
        description: form.description || '',
        price: form.price || '',
        originalPrice: form.originalPrice || '',
        discount: form.discount || '',
        rating: form.rating || '',
        reviews: form.reviews || '',
        compatibility: form.compatibility?.split(',').map((s: string) => s.trim()) || [],
        detailedDescription: form.detailedDescription?.split('\n') || [],
        mediaUrl,
        docUrl,
        updatedAt: serverTimestamp(),
      };

      if (form.id) {
        await updateDoc(doc(db, 'products', form.id), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), payload);
      }

      await fetchProducts();
      clearForm();
      alert('✅ Produit enregistré !');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de l’enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setForm({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      rating: p.rating,
      reviews: p.reviews,
      compatibility: (p.compatibility || []).join(', '),
      detailedDescription: (p.detailedDescription || []).join('\n'),
    });
    setMediaFile(null);
    setDocFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter(p => p.id !== id));
    alert('🗑️ Produit supprimé.');
  };

  if (role === null) {
    return <div className="text-white text-center mt-40">Chargement en cours...</div>;
  }

  if (!user || role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-24 pb-12 text-white">
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-violet-400">
            {form.id ? '✏️ Modifier produit' : '➕ Ajouter un produit'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="title" placeholder="Titre" value={form.title} onChange={handleChange} className="bg-white/10 text-white/80 p-3 rounded-lg"/>
            <input name="price" placeholder="Prix" value={form.price} onChange={handleChange} className="bg-white/10 text-white/80 p-3 rounded-lg"/>
          </div>

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={2} className="bg-white/10 text-white/80 p-3 rounded-lg w-full"/>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <input name="originalPrice" placeholder="Prix original" value={form.originalPrice} onChange={handleChange} className="bg-white/10 text-white/80 p-3 rounded-lg"/>
            <input name="discount" placeholder="Réduction" value={form.discount} onChange={handleChange} className="bg-white/10 text-white/80 p-3 rounded-lg"/>
            <input name="rating" placeholder="Note" value={form.rating} onChange={handleChange} className="bg-white/10 text-white/80 p-3 rounded-lg"/>
            <input name="reviews" placeholder="Avis" value={form.reviews} onChange={handleChange} className="bg-white/10 text-white/80 p-3 rounded-lg"/>
          </div>

          <textarea name="compatibility" placeholder="Compatibilité (ex: TradingView, MT4)" value={form.compatibility} onChange={handleChange} className="bg-white/10 text-white/80 p-3 rounded-lg w-full"/>
          <textarea name="detailedDescription" placeholder="Desc détaillée (1 ligne = 1 item)" value={form.detailedDescription} onChange={handleChange} rows={4} className="bg-white/10 text-white/80 p-3 rounded-lg w-full"/>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-white/60">Image / Vidéo</label>
              <input type="file" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files?.[0] || null)} className="text-white/70"/>
            </div>
            <div>
              <label className="block mb-2 text-white/60">Fichier PDF ou TXT</label>
              <input type="file" accept=".pdf,.txt" onChange={e => setDocFile(e.target.files?.[0] || null)} className="text-white/70"/>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold shadow-lg">
            {loading ? 'Enregistrement…' : form.id ? '✅ Mettre à jour' : '✅ Ajouter le produit'}
          </motion.button>
        </form>

        <div className="mt-12 space-y-6">
          {products.map(p => (
            <motion.div key={p.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-violet-400">{p.title}</h3>
                <p className="text-white/70">{p.price} €</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(p)} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg">✏️ Editer</button>
                <button onClick={() => handleDelete(p.id)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg">🗑️ Suppr.</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
