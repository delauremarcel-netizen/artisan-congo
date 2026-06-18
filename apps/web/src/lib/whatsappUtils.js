import pb from '@/lib/pocketbaseClient.js';

/**
 * Formats a local phone number to international format (e.g., +243 for Congo)
 */
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-numeric characters except '+'
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it already has a plus, assume it's correctly formatted
  if (cleaned.startsWith('+')) {
    return cleaned.substring(1); // wa.me expects number without '+'
  }
  
  // If it starts with 0, replace with 243 (Congo code)
  if (cleaned.startsWith('0')) {
    return '243' + cleaned.substring(1);
  }
  
  // If it doesn't start with 0 or +, assume it might already have the country code
  // or just return as is and let WhatsApp handle it
  return cleaned;
};

/**
 * Validates if a phone number looks like a valid WhatsApp number
 */
export const validateWhatsAppNumber = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Basic validation: between 9 and 15 digits
  return cleaned.length >= 9 && cleaned.length <= 15;
};

/**
 * Generates a properly encoded WhatsApp link for direct artisan contact.
 */
export const generateWhatsAppLink = (artisan) => {
  if (!artisan) return '#';
  
  const phone = formatWhatsAppNumber(artisan.whatsapp || artisan.phone);
  
  // Fallback to centralized number if artisan has no valid number
  if (!phone) {
    const centralizedNumber = '33605884875';
    const name = artisan.name || 'Inconnu';
    const category = artisan.category || 'Non spécifié';
    const text = `Bonjour Artisan Congo, je souhaite contacter cet artisan : ${name} - ${category}`;
    return `https://wa.me/${centralizedNumber}?text=${encodeURIComponent(text)}`;
  }
  
  // Direct contact message
  const category = artisan.category || 'vos services';
  const text = `Bonjour, je suis intéressé par vos services de ${category}.`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

/**
 * Tracks a click on the WhatsApp button, increments counters, and creates a lead.
 * This should be used as a fire-and-forget Promise to avoid blocking synchronous window.open()
 */
export const trackWhatsAppClick = async (artisanId) => {
  try {
    // Best-effort update on the artisan profile stats
    try {
      const artisan = await pb.collection('artisans').getOne(artisanId, { $autoCancel: false });
      const currentCount = artisan.whatsapp_click_count || 0;
      await pb.collection('artisans').update(artisanId, {
        whatsapp_click_count: currentCount + 1,
        last_whatsapp_click_at: new Date().toISOString()
      }, { $autoCancel: false });
    } catch (e) {
      console.warn('Stat update skipped (possible access rule limitation).', e);
    }

    // Create the lead
    const leadData = {
      artisan_id: artisanId,
      message: "Contact direct généré via le bouton WhatsApp du profil public.",
      status: 'nouveau',
      payment_status: 'non_payé',
      client_name: 'Anonyme (Clic WhatsApp)'
    };
    await pb.collection('leads').create(leadData, { $autoCancel: false });
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
  }
};

/**
 * Creates a formal lead.
 */
export const createLead = async (artisanId, clientData) => {
  const data = {
    artisan_id: artisanId,
    ...clientData,
    status: 'nouveau',
    payment_status: 'non_payé'
  };
  return await pb.collection('leads').create(data, { $autoCancel: false });
};

/**
 * Updates lead status and triggers necessary recalculations in backend hooks.
 */
export const updateLeadStatus = async (leadId, newStatus) => {
  const data = { status: newStatus };
  if (newStatus === 'terminé') {
    data.completed_at = new Date().toISOString();
  }
  return await pb.collection('leads').update(leadId, data, { $autoCancel: false });
};

/**
 * Calculates commission and artisan net amount.
 */
export const calculateCommission = (devisAmount, commissionRate = 10) => {
  const amount = Number(devisAmount) || 0;
  const rate = Number(commissionRate) || 0;
  const commission_amount = amount * (rate / 100);
  const artisan_amount = amount - commission_amount;
  return { commission_amount, artisan_amount };
};