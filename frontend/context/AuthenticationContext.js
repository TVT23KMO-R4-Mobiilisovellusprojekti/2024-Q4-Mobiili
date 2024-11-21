import React, { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { getAuthenticatedUserData } from "../services/firestoreUsers";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await getAuthenticatedUserData(user.uid);
        setAuthState({
          user: {
            id: user.uid,
            ...data,
          },
        });
      } else {
        setAuthState(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthenticationContext.Provider value={ authState }>
      {children}
    </AuthenticationContext.Provider>
  );
};