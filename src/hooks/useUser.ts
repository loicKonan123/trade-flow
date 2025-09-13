"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseClient";

export function useUser() {
  const [user, loading, error] = useAuthState(auth);
  return { user, loading, error };
}
