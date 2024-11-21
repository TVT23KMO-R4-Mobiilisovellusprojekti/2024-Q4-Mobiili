import React, { createContext, useEffect, useState } from "react";
import { auth, firestore } from "../services/firebaseConfig";
import { doc, getDoc, where } from "firebase/firestore";
import {
  clearAuthData,
  getAuthData,
  storeAuthData,
} from "../utils/storageUtils";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getAuthData();
      if (data) {
        const userRef = doc(firestore, "users", data.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setAuthState({
            user: {
              id: userSnap.id,
              ...userSnap.data(),
            },
          });
        }
      }
      setLoading(false);
      
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", where("uid", "==", user.uid));
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setAuthState({
            user: {
              id: userSnap.id,
              ...userSnap.data(),
            },
          });

          storeAuthData(user.uid, user.accessToken);
        }
      } else {
        setAuthState(null);
        clearAuthData();
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ setAuthState, authState, loading }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
