import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import MessageInput from './MessageInput';
import pb from '@/lib/pocketbaseClient';

const ConversationView = ({ conversation, currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const records = await pb.collection('messages').getFullList({
          filter: `conversation_id="${conversation.id}"`,
          sort: '+timestamp',
          $autoCancel: false
        });
        setMessages(records);
        markAsRead(records);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();

    // Subscribe to real-time messages for this conversation
    const unsubscribe = pb.collection('messages').subscribe('*', (e) => {
      if (e.action === 'create' && e.record.conversation_id === conversation.id) {
        setMessages(prev => [...prev, e.record]);
        if (e.record.receiver_id === currentUser.id) {
          markAsRead([e.record]);
        }
        scrollToBottom();
      }
    });

    return () => {
      pb.collection('messages').unsubscribe('*');
    };
  }, [conversation?.id, currentUser.id]);

  const markAsRead = async (msgs) => {
    const unreadMsgs = msgs.filter(m => m.receiver_id === currentUser.id && m.read_status === 'unread');
    for (const msg of unreadMsgs) {
      try {
        await pb.collection('messages').update(msg.id, { read_status: 'read' }, { $autoCancel: false });
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  if (!conversation || !otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground bg-muted/10">
        Sélectionnez une conversation pour commencer
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b bg-background flex items-center gap-3 shadow-sm z-10">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {otherUser.name?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherUser.name || 'Utilisateur'}</h2>
          <p className="text-xs text-muted-foreground">
            {otherUser.account_type === 'artisan' ? otherUser.category : 'Client'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tl-sm" />
            <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tr-sm ml-auto" />
            <Skeleton className="h-16 w-3/4 rounded-2xl rounded-tl-sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Aucun message. Envoyez le premier message !
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    isOwn 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-card border shadow-sm rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message_text}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {new Date(msg.timestamp || msg.created).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {isOwn && (
                    <span className="ml-1">
                      {msg.read_status === 'read' ? '✓✓' : '✓'}
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <MessageInput 
        conversationId={conversation.id}
        receiverId={otherUser.id}
        artisanId={otherUser.account_type === 'artisan' ? otherUser.id : currentUser.id}
        currentUserId={currentUser.id}
      />
    </div>
  );
};

export default ConversationView;