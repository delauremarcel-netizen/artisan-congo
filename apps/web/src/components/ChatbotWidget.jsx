import React, { useState } from 'react';
import { MessageCircle, X, Phone, Mail, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IntegratedAiChat from '@/components/integrated-ai-chat.jsx';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed z-[100] bottom-4 right-4 md:bottom-24 md:right-6 w-[calc(100%-32px)] md:w-[400px] h-[500px] bg-white border border-gray-200 rounded-[12px] shadow-[0_20px_40px_rgb(0,0,0,0.12)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-[16px]">Artisan Congo Support</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-md smooth-transition"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap gap-2 shrink-0 justify-center">
              <a href="https://wa.me/33605884875" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded hover:border-primary hover:text-primary smooth-transition">
                <Phone className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <a href="mailto:contact@artisancongo.com" className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded hover:border-primary hover:text-primary smooth-transition">
                <Mail className="w-3.5 h-3.5" /> Envoyer email
              </a>
              <a href="https://www.artisancongo.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded hover:border-primary hover:text-primary smooth-transition">
                <Globe className="w-3.5 h-3.5" /> Visiter site
              </a>
            </div>

            {/* Chat Content Area */}
            <div className="flex-1 overflow-hidden relative bg-white">
              <IntegratedAiChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-[90] w-[56px] h-[56px] rounded-full bg-primary text-white flex items-center justify-center shadow-[0_8px_20px_rgba(45,80,22,0.3)] hover:scale-110 smooth-transition"
            aria-label="Ouvrir le support"
          >
            <MessageCircle className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;