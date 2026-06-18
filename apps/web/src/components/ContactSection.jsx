import React from 'react';
import { Phone, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const ContactSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Nous contacter</h2>
          <p className="text-lg text-muted-foreground">Notre équipe est à votre disposition pour répondre à toutes vos questions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone */}
          <motion.a
            href="tel:+33605884875"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block group"
          >
            <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Téléphone</h3>
                <p className="text-muted-foreground font-medium">00 33 6 05 88 48 75</p>
              </CardContent>
            </Card>
          </motion.a>

          {/* Email */}
          <motion.a
            href="mailto:contact@artisancongo.com"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="block group"
          >
            <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Mail className="w-8 h-8 text-secondary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Email</h3>
                <p className="text-muted-foreground font-medium">contact@artisancongo.com</p>
              </CardContent>
            </Card>
          </motion.a>

          {/* Website */}
          <motion.a
            href="https://www.artisancongo.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="block group"
          >
            <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Globe className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Site web</h3>
                <p className="text-muted-foreground font-medium">www.artisancongo.com</p>
              </CardContent>
            </Card>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;