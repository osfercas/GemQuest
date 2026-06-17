import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import { signOut as firebaseSignOut } from '../services/auth';

interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), u => {
      setIsSignedIn(!!u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Re-reads currentUser from Firebase on every tick so profile updates are reflected
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const user = useMemo(() => (isSignedIn ? getAuth().currentUser : null), [isSignedIn, tick]);

  const refreshUser = useCallback(() => setTick(t => t + 1), []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: firebaseSignOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
