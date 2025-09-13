'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useUserRole } from '@/hooks/userUserRole';

type Script = {
  id: string;
  title?: string;
  description?: string;
  pineScript?: string;
  userId?: string;
  status?: 'pending' | 'completed' | 'rejected';
  createdAt?: { toDate: () => Date };
};

export default function AdminDashboard() {
  const { user, role, isLoading: authLoading } = useUserRole();
  const router = useRouter();

  const [scripts, setScripts] = useState<Script[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  const [sortAsc, setSortAsc] = useState(false);
  const [count, setCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  // Vérification des autorisations
  useEffect(() => {
    if (authLoading) return;
    if (!user || role !== 'admin') {
      router.push('/');
    }
  }, [user, role, authLoading, router]);

  // Chargement des données
  useEffect(() => {
    if (!user || role !== 'admin' || authLoading) return;

    const loadData = async () => {
      try {
        // Charger le compteur
        const confSnap = await getDoc(doc(db, 'admin', 'config'));
        setCount(confSnap.exists() ? confSnap.data().scriptsCount || 0 : 0);

        // Charger les scripts
        const q = query(collection(db, 'scripts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Script[];
        setScripts(data);
      } catch (error) {
        console.error('Erreur de chargement:', error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user, role, authLoading]);

  if (authLoading || dataLoading) {
    return <Loader message="Chargement Admin..." />;
  }

  if (!user || role !== 'admin') {
    return null;
  }

  const filtered = scripts.filter(s => filter === 'all' || s.status === filter)
    .sort((a, b) => {
      const tA = a.createdAt?.toDate().getTime() || 0;
      const tB = b.createdAt?.toDate().getTime() || 0;
      return sortAsc ? tA - tB : tB - tA;
    });

  async function updateStatus(id: string, newStatus: 'completed' | 'rejected') {
    if (newStatus === 'rejected' && !confirm('Supprimer ce script ?')) return;
    await updateDoc(doc(db, 'scripts', id), {
      status: newStatus,
    });
    if (newStatus === 'rejected') {
      setScripts(prev => prev.filter(s => s.id !== id));
    } else {
      setScripts(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    }
  }

  async function savePine(id: string, pine: string) {
    await updateDoc(doc(db, 'scripts', id), {
      pineScript: pine,
      status: 'completed',
      updatedAt: serverTimestamp()
    });
    setScripts(prev => prev.map(s => s.id === id ? { ...s, pineScript: pine, status: 'completed' } : s));
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-24 pb-12 flex flex-col gap-8">
        <HeaderDashboard count={count} />
        <Controls 
          filter={filter} 
          setFilter={setFilter} 
          sortAsc={sortAsc} 
          setSortAsc={() => setSortAsc(prev => !prev)} 
        />

        {filtered.length === 0 ? (
          <p className="text-center text-white/60 mt-8">Aucun script.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map(s => (
              <ScriptCard 
                key={s.id} 
                script={s}
                onSavePine={savePine}
                onDelete={() => updateStatus(s.id, 'rejected')}
                onValidate={() => updateStatus(s.id, 'completed')}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// Composants internes
function Loader({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
      {message}
    </div>
  );
}

function HeaderDashboard({ count }: { count: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg text-center"
    >
      <h1 className="text-2xl text-white mb-2">Admin Dashboard</h1>
      <p className="text-violet-400 text-4xl font-bold">{count} scripts soumis</p>
    </motion.div>
  );
}

function Controls({
  filter,
  setFilter,
  sortAsc,
  setSortAsc
}: {
  filter: string;
  setFilter: (f: string) => void;
  sortAsc: boolean;
  setSortAsc: () => void;
}) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="px-4 py-2 bg-violet-700 text-white rounded-xl"
      >
        {['all', 'pending', 'completed', 'rejected'].map(x => (
          <option value={x} key={x}>
            {x === 'all' ? 'Tous' : x === 'pending' ? 'En attente' : x === 'completed' ? 'Validés' : 'Refusés'}
          </option>
        ))}
      </select>
      <button
        onClick={setSortAsc}
        className="px-4 py-2 bg-white/10 text-white rounded-xl"
      >
        Trier {sortAsc ? '⬆️' : '⬇️'}
      </button>
    </div>
  );
}

function ScriptCard({
  script,
  onSavePine,
  onDelete,
  onValidate
}: {
  script: Script;
  onSavePine: (id: string, pine: string) => void;
  onDelete: () => void;
  onValidate: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 } cddce
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl text-violet-400 font-bold">{script.title}</h3>
        <StatusBadge status={script.status} />
      </div>

      <p className="text-white/70 mb-4">{script.description}</p>

      <textarea
        defaultValue={script.pineScript || ''}
        placeholder="Ajoute ton Pine Script…"
        className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-white monospaced h-32"
        onBlur={e => onSavePine(script.id, e.target.value.trim())}
      />

      <div className="mt-4 flex gap-3">
        {script.status === 'pending' && (
          <>
            <button
              onClick={onValidate}
              className="px-4 py-2 bg-green-600 rounded-lg text-white"
            >
              ✅ Valider
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 rounded-lg text-white"
            >
              ❌ Refuser
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-white/40 mt-2">
        Soumis par <span className="text-white/80">{script.userId}</span> •{' '}
        {script.createdAt?.toDate().toLocaleString()}
      </p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const base = 'px-3 py-1 text-xs rounded-full font-semibold';
  if (status === 'pending') return <span className={`${base} bg-yellow-400/20 text-yellow-400`}>En attente</span>;
  if (status === 'completed') return <span className={`${base} bg-green-400/20 text-green-400`}>Validé</span>;
  if (status === 'rejected') return <span className={`${base} bg-red-400/20 text-red-400`}>Refusé</span>;
  return null;
}