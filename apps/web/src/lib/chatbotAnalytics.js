import pb from '@/lib/pocketbaseClient.js';

/**
 * Generates or retrieves a unique session ID for the current chat session.
 * Cleared when the browser tab is closed.
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('chatbot_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('chatbot_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Logs a chatbot interaction event to the PocketBase collection.
 * 
 * @param {string} eventType - The type of event (greeting, category_selected, lead_created, etc.)
 * @param {Object} data - Optional data payload
 * @param {string} data.category - The service category discussed
 * @param {string} data.city - The city discussed
 * @param {string} data.urgency - The urgency level
 * @param {string} data.clientName - The client's name
 */
export const logChatEvent = async (eventType, data = {}) => {
  try {
    await pb.collection('chatbot_interactions').create({
      event_type: eventType,
      category: data.category || '',
      city: data.city || '',
      urgency: data.urgency || '',
      client_name: data.clientName || '',
      session_id: getSessionId(),
    }, { $autoCancel: false });
  } catch (error) {
    console.error('Failed to log chatbot event:', error);
  }
};

/**
 * Tracks when a user successfully converts to a lead.
 * @param {Object} leadData - The lead information
 */
export const trackConversion = (leadData) => {
  return logChatEvent('lead_created', leadData);
};

/**
 * Tracks when a user views a specific FAQ.
 * @param {string} question - The FAQ topic viewed
 */
export const trackFAQView = (question) => {
  return logChatEvent('faq_viewed', { category: question });
};

/**
 * Tracks when a user clicks a WhatsApp link from the chat.
 */
export const trackWhatsAppClick = (data = {}) => {
  return logChatEvent('whatsapp_clicked', data);
};