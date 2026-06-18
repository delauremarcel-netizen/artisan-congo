import { useState } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { PLATFORM_PHONE_NUMBER } from '@/lib/whatsappConfig.js';

export const useLeadCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLead = async (leadData) => {
    setLoading(true);
    setError(null);
    try {
      // Create lead record
      const record = await pb.collection('leads').create({
        ...leadData,
        status: 'Nouveau'
      }, { $autoCancel: false });

      // Format WhatsApp message
      const artisanInfo = leadData.assigned_artisan ? `\nArtisan souhaité: ${leadData.artisan_name}` : '';
      const message = `Bonjour ArtisanCongo, je souhaite demander un devis.\n\nID Demande: ${record.id}\nNom: ${leadData.client_name}\nCatégorie: ${leadData.category}${artisanInfo}\nProjet: ${leadData.project_description}`;
      
      const whatsappUrl = `https://wa.me/${PLATFORM_PHONE_NUMBER.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;

      setLoading(false);
      return { success: true, record, whatsappUrl };
    } catch (err) {
      console.error('Error creating lead:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de la demande.');
      setLoading(false);
      return { success: false, error: err };
    }
  };

  return { createLead, loading, error };
};