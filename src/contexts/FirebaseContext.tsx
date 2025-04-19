import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth, initializeAnalytics } from '@/api/firebase';

// Define the context type
interface FirebaseContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

// Create the context with default values
const FirebaseContext = createContext<FirebaseContextType>({
  currentUser: null,
  loading: true,
  signIn: () => Promise.reject('Not implemented'),
  signUp: () => Promise.reject('Not implemented'),
  signOut: () => Promise.reject('Not implemented'),
  resetPassword: () => Promise.reject('Not implemented'),
  updateUserProfile: () => Promise.reject('Not implemented'),
});

// Custom hook to use the Firebase context
export const useFirebase = () => useContext(FirebaseContext);

// Provider component
interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize analytics if in browser environment
    const setupAnalytics = async () => {
      await initializeAnalytics();
    };
    setupAnalytics();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up subscription
    return unsubscribe;
  }, []);

  // Authentication methods
  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!currentUser) {
      throw new Error('No user is signed in');
    }
    await updateProfile(currentUser, {
      displayName,
      photoURL: photoURL || null,
    });
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
