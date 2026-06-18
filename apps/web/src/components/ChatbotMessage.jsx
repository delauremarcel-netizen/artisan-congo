import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatbotMessage = ({ question, answer, cta }) => {
  const handleEmailClick = () => {
    window.open('mailto:contact@artisancongo.com', '_blank');
  };

  // Split answer by newlines to render proper paragraph breaks
  const formattedAnswer = answer.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < answer.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 w-full"
    >
      {/* User Question Bubble */}
      <div className="self-end max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-sm">
        <p className="text-sm font-medium">{question}</p>
      </div>

      {/* Bot Answer Bubble */}
      <div className="self-start max-w-[90%] bg-card border border-border/50 text-card-foreground rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
        <div className="px-5 py-4 text-sm leading-relaxed">
          {formattedAnswer}
        </div>
        
        <div className="bg-muted/40 px-5 py-3 border-t border-border/50 flex justify-end">
          <Button 
            onClick={handleEmailClick}
            variant="outline"
            className="w-full sm:w-auto shadow-sm transition-all active:scale-[0.98] font-medium h-10"
          >
            <Mail className="w-3.5 h-3.5 mr-2" />
            {cta || "contact@artisancongo.com"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatbotMessage;