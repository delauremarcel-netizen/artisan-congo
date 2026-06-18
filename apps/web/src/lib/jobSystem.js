import pb from '@/lib/pocketbaseClient';

export const IDGenerator = {
  generateDemandeId: () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEM-${year}-${random}`;
  }
};

export const CommissionCalculator = {
  calculate: (totalPrice) => {
    const num = parseFloat(totalPrice) || 0;
    return {
      commission_20_pourcent: num * 0.20,
      prix_artisan: num * 0.80,
    };
  }
};

export const NotificationLogger = {
  log: async (artisanId, message, type = 'info') => {
    try {
      if (!artisanId) return;
      await pb.collection('notifications').create({
        artisan_id: artisanId,
        message,
        status_change: type,
        read: false
      }, { $autoCancel: false });
    } catch (err) {
      console.error('Failed to log notification', err);
    }
  }
};

export const MessagesService = {
  getChantierMessages: async (chantierId) => {
    return await pb.collection('messages').getFullList({
      filter: `conversation_id = "${chantierId}"`,
      sort: '+created',
      $autoCancel: false
    });
  },
  sendMessage: async (senderId, receiverId, artisanId, chantierId, text) => {
    return await pb.collection('messages').create({
      sender_id: senderId,
      receiver_id: receiverId,
      artisan_id: artisanId,
      conversation_id: chantierId,
      message_text: text,
      read_status: 'unread'
    }, { $autoCancel: false });
  }
};