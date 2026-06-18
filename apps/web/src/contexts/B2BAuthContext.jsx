import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const B2BAuthContext = createContext();

export const useB2BAuth = () => useContext(B2BAuthContext);

export const B2BAuthProvider = ({ children }) => {
  const [currentEnterprise, setCurrentEnterprise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial state
    const model = pb.authStore.model;
    if (model && model.collectionName === 'entreprises') {
      setCurrentEnterprise(model);
    }
    setIsLoading(false);

    // Subscribe to auth changes
    return pb.authStore.onChange((token, model) => {
      if (model && model.collectionName === 'entreprises') {
        setCurrentEnterprise(model);
      } else {
        setCurrentEnterprise(null);
      }
    });
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('entreprises').authWithPassword(email, password, { $autoCancel: false });
      setCurrentEnterprise(authData.record);
      return authData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentEnterprise(null);
  };

  const signup = async (data) => {
    try {
      const record = await pb.collection('entreprises').create(data, { $autoCancel: false });
      await login(data.email, data.password);
      return record;
    } catch (error) {
      throw error;
    }
  };

  return (
    <B2BAuthContext.Provider value={{ 
      currentEnterprise, 
      isAuthenticated: !!currentEnterprise, 
      login, 
      logout, 
      signup, 
      isLoading 
    }}>
      {children}
    </B2BAuthContext.Provider>
  );
};