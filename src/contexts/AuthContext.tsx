import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, UserCredential } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { AuthContextType, User } from '../types';
import { 
  signupWithEmail, 
  loginWithEmail, 
  loginWithGoogle, 
  logoutUser 
} from '../services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email!,
  displayName: firebaseUser.displayName || undefined,
  photoURL: firebaseUser.photoURL || undefined,
  createdAt: new Date(firebaseUser.metadata.creationTime!)
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(mapFirebaseUserToUser(firebaseUser));
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    try {
      const userCredential = await signupWithEmail(email, password);
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    try {
      const userCredential = await loginWithEmail(email, password);
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (): Promise<UserCredential> => {
    setLoading(true);
    try {
      const userCredential = await loginWithGoogle();
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await logoutUser();
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    googleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
