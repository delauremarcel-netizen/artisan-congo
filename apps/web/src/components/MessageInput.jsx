import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const MessageInput = ({ conversationId, receiverId, artisanId, currentUserId }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const textToSend = message.trim();
    setMessage('');
    setLoading(true);

    try {
      // Create message
      await pb.collection('messages').create({
        sender_id: currentUserId,
        receiver_id: receiverId,
        artisan_id: artisanId || receiverId, // Fallback if artisanId isn't explicitly known
        message_text: textToSend,
        conversation_id: conversationId,
        read_status: 'unread'
      }, { $autoCancel: false });

      // Update conversation last message
      await pb.collection('conversations').update(conversationId, {
        last_message: textToSend,
        last_message_date: new Date().toISOString()
      }, { $autoCancel: false });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      setMessage(textToSend); // Restore message on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2 p-4 bg-background border-t">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écrivez votre message..."
        className="flex-1"
        disabled={loading}
      />
      <Button type="submit" size="icon" disabled={!message.trim() || loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
};

export default MessageInput;