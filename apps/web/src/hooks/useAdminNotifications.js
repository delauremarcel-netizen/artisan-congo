import { useState, useEffect } from 'react';
import apiServerClient from '@/lib/apiServerClient.js';

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('Token manquant');
          return;
        }

        const response = await apiServerClient.fetch('/admin/notifications?read=false&limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des notifications');
        }

        const data = await response.json();
        setNotifications(data.items || []);
      } catch (err) {
        console.error('Admin notifications error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return { notifications, loading, error };
}