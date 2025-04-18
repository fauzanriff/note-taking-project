import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, initializeAnalytics } from '@/lib/firebase';

// Define the context type
interface FirebaseContextType {
  currentUser: User | null;
  loading: boolean;
}

// Create the context with default values
const FirebaseContext = createContext<FirebaseContextType>({
  currentUser: null,
  loading: true,
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

  const value = {
    currentUser,
    loading,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
