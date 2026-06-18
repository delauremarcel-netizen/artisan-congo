import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const ChatbotHeader = ({ onBack, showBack }) => {
  return (
    <div className="bg-primary px-6 py-5 text-primary-foreground shadow-md relative overflow-hidden shrink-0">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10 flex items-start gap-4">
        {showBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-primary-foreground/90 hover:text-white hover:bg-white/20 shrink-0 -ml-2 rounded-full h-9 w-9 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-serif text-xl font-semibold tracking-tight">
              Assistant Kongo
            </h1>
          </div>
          <p className="text-sm text-primary-foreground/90 leading-relaxed max-w-[280px] font-medium">
            Bonjour 👋 Comment puis-je vous aider ?<br/>
            <a href="mailto:contact@artisancongo.com" className="underline hover:text-white transition-colors">contact@artisancongo.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotHeader;