'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebaseClient';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

export function useUserRole() {
  const [user, userLoading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setRoleLoading(true);
      try {
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          setRole(docSnap.exists() ? docSnap.data().role || null : null);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return {
    user,
    role,
    isLoading: userLoading || roleLoading
  };
}