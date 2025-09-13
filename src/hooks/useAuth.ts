"use client";

import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const signUp = async (email: string, password: string) => {
        setLoading(true);
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Enregistre dans Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: serverTimestamp(),
                role: "user",
            });

            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    //   const signIn = async (email: string, password: string) => {
    //     setLoading(true);
    //     setError("");
    //     try {
    //       await signInWithEmailAndPassword(auth, email, password);
    //       return true;  // ✅ Connexion réussie
    //     } catch (err: any) {
    //       setError(err.message);
    //       return false; // ❌ Connexion échouée
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    const signIn = async (email: string, password: string) => {
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;  // ✅ Connexion OK
        } catch (err: any) {
            console.error(err);
            switch (err.code) {
                case "auth/user-not-found":
                    setError("Aucun compte trouvé pour cet email.");
                    break;
                case "auth/wrong-password":
                case "auth/invalid-credential":
                    setError("Mot de passe incorrect.");
                    break;
                case "auth/invalid-email":
                    setError("Email invalide.");
                    break;
                default:
                    setError("Une erreur est survenue. Veuillez réessayer.");
                    break;
            }
            return false;  // ❌ Connexion KO
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email: string) => {
        setLoading(true);
        setError("");
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return {
        signUp,
        signIn,
        resetPassword,
        logout,
        loading,
        error,
    };
}
