import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { toast } from 'sonner';

/**
 * Middleware hook to handle admin API errors globally, specifically catching 401 Unauthorized responses.
 */
export const useAdminApiHandler = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleUnauthorized = () => {
    // 1. Clear admin auth state & token from storage
    logout(false);
    // 2. Show toast message exactly as requested
    toast.error('Session expired. Please login again.');
    // 3. Redirect to login
    navigate('/admin/login');
  };

  const checkResponse = async (response) => {
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'La requête a échoué');
    }
    
    return response;
  };

  return { handleUnauthorized, checkResponse };
};