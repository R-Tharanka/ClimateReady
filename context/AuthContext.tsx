// context/AuthContext.tsx
import { UserProfile, createEmptyUserProfile } from '../utils/userDataModel';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, createUserDocument, getUserDocument, updateUserDocument } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export type AuthContextType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: (UserProfile & { password?: string }) | null;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  reloadUserProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<(UserProfile & { password?: string }) | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setIsLoggedIn(true);
        setUser({ email: firebaseUser.email || '' } as any);
        setUserUid(firebaseUser.uid);
        // Fetch user profile from Firestore
        try {
          const docSnap = await getUserDocument(firebaseUser.uid);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          setUserProfile(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserProfile(null);
        setUserUid(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);



  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser({ email: firebaseUser.email || '' } as any);
      setUserUid(firebaseUser.uid);
      // Fetch user profile from Firestore
      const docSnap = await getUserDocument(firebaseUser.uid);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const profile: UserProfile = createEmptyUserProfile(email, firstName, lastName);
      await createUserDocument(firebaseUser.uid, profile);
      setUser({ email: firebaseUser.email || '' } as any);
      setUserUid(firebaseUser.uid);
      setUserProfile(profile);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
    setUserProfile(null);
    setUserUid(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (userUid) {
      const updatedProfile = { ...userProfile, ...data };
      setUserProfile(updatedProfile as UserProfile);
      await updateUserDocument(userUid, updatedProfile);
    }
  };

  const reloadUserProfile = async () => {
    if (userUid) {
      const docSnap = await getUserDocument(userUid);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, user, userProfile, setUserProfile, updateUserProfile, reloadUserProfile, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};