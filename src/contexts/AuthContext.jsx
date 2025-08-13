import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy users for demonstration
  const dummyUsers = [
    { id: 1, email: 'student@demo.com', password: 'password123', role: 'student', name: 'Sarah Johnson' },
    { id: 2, email: 'teacher@demo.com', password: 'password123', role: 'teacher', name: 'Dr. Michael Chen' }
  ];

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = Cookies.get('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = dummyUsers.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const userData = { ...foundUser };
      delete userData.password;
      
      setUser(userData);
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        ...userData
      };
      delete newUser.password;
      
      setUser(newUser);
      Cookies.set('user', JSON.stringify(newUser), { expires: 7 });
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};