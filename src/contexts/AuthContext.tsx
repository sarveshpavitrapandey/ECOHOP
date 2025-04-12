
import React, { createContext, useContext, useState, useEffect } from "react";

// Dummy user type
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Dummy users for testing
const dummyUsers = [
  {
    uid: "user1",
    email: "user@example.com",
    password: "password", // In a real app, you'd never store passwords in plain text
    displayName: "Demo User",
    photoURL: "https://i.pravatar.cc/150?u=user1"
  },
  {
    uid: "user2",
    email: "admin@example.com",
    password: "admin123",
    displayName: "Admin User",
    photoURL: "https://i.pravatar.cc/150?u=user2"
  }
];

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("ecoHopUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string) => {
    // Create a new user
    const newUser = {
      uid: `user${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    
    // Store in localStorage
    localStorage.setItem("ecoHopUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  const login = async (email: string, password: string) => {
    // Find user with matching email and password
    const user = dummyUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    // Create user object without password
    const loggedInUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    
    // Store in localStorage
    localStorage.setItem("ecoHopUser", JSON.stringify(loggedInUser));
    setCurrentUser(loggedInUser);
  };

  const loginWithGoogle = async () => {
    // Just use the first dummy user for Google login
    const user = dummyUsers[0];
    
    const loggedInUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    
    localStorage.setItem("ecoHopUser", JSON.stringify(loggedInUser));
    setCurrentUser(loggedInUser);
  };

  const logout = async () => {
    localStorage.removeItem("ecoHopUser");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
