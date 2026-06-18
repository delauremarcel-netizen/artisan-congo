import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(
    pb.authStore.model?.collectionName === 'admin_users' ? pb.authStore.model : null
  );
  const [token, setToken] = useState(
    pb.authStore.model?.collectionName === 'admin_users' ? pb.authStore.token : null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    return pb.authStore.onChange((newToken, model) => {
      if (model?.collectionName === 'admin_users') {
        setCurrentAdmin(model);
        setToken(newToken);
      } else {
        setCurrentAdmin(null);
        setToken(null);
      }
    });
  }, []);

  const getToken = () => pb.authStore.token;

  const login = async (email, password) => {
    const authData = await pb.collection('admin_users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentAdmin(authData.record);
    setToken(authData.token);
    return authData;
  };

  const logout = () => {
    if (pb.authStore.model?.collectionName === 'admin_users') {
      pb.authStore.clear();
    }
    setCurrentAdmin(null);
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ 
      currentAdmin, 
      token, 
      getToken,
      login, 
      logout, 
      isLoading, 
      isAuthenticated: !!currentAdmin 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};