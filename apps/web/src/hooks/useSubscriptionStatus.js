import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';

export const useSubscriptionStatus = () => {
  const { currentUser, accountType } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!currentUser || accountType !== 'entreprise') {
        setIsActive(true); // Non-companies are considered active for this specific check
        setLoading(false);
        return;
      }

      try {
        const records = await pb.collection('company_subscriptions').getList(1, 1, {
          filter: `company_id="${currentUser.id}" && status="active"`,
          sort: '-created',
          $autoCancel: false
        });

        if (records.items.length > 0) {
          const sub = records.items[0];
          // Check if end_date is in the future
          const isNotExpired = new Date(sub.end_date) > new Date();
          setIsActive(isNotExpired);
          setSubscription(sub);
          
          // Auto-update status if expired
          if (!isNotExpired && sub.status === 'active') {
            await pb.collection('company_subscriptions').update(sub.id, { status: 'expired' }, { $autoCancel: false });
          }
        } else {
          setIsActive(false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [currentUser, accountType]);

  return { isActive, loading, subscription };
};