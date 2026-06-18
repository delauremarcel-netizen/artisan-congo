import React from 'react';
import { Helmet } from 'react-helmet';
import IntegratedAiChat from '@/components/integrated-ai-chat.jsx';
import { MessageSquare as BotMessageSquare, Sparkles } from 'lucide-react';

const ChatbotPage = () => {
  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-16 flex flex-col">
      <Helmet>
        <title>{`Assistant Kongo | ArtisanCongo`}</title>
        <meta name="description" content="Échangez avec Assistant Kongo, notre assistant virtuel intelligent, pour trouver le meilleur artisan pour votre projet ou répondre à vos questions." />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl flex-1 flex flex-col">
        <div className="mb-10 text-center relative z-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
            <BotMessageSquare className="w-8 h-8" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
            Assistant Kongo
          </h1>
          <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Posez vos questions, décrivez votre projet ou demandez de l'aide pour naviguer sur la plateforme. Assistant Kongo est là pour vous accompagner. Vous pouvez aussi nous écrire à <a href="mailto:contact@artisancongo.com" className="text-primary hover:underline font-medium transition-colors">contact@artisancongo.com</a>.
          </p>
        </div>

        <div className="flex-1 bg-card rounded-2xl shadow-xl shadow-primary/5 border border-border/80 overflow-hidden min-h-[600px] max-h-[800px] relative z-10 flex flex-col">
          <div className="absolute inset-0">
            <IntegratedAiChat />
          </div>
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-0"></div>
    </div>
  );
};

export default ChatbotPage;