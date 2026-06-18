import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, CheckCheck } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const ChatBubble = ({ message, isOwnMessage, otherUser }) => {
  const timeString = new Date(message.timestamp || message.created).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex w-full mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[75%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {!isOwnMessage && (
          <Avatar className="w-8 h-8 flex-shrink-0 mb-1">
            <AvatarImage src={otherUser?.avatar ? pb.files.getUrl(otherUser, otherUser.avatar) : ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {otherUser?.name?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div 
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage 
                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                : 'bg-muted text-foreground rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed break-words">{message.message_text}</p>
          </div>
          
          <div className="flex items-center gap-1 mt-1 px-1">
            <span className="text-[10px] text-muted-foreground">{timeString}</span>
            {isOwnMessage && (
              message.read_status === 'read' 
                ? <CheckCheck className="w-3 h-3 text-primary" /> 
                : <Check className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatBubble;