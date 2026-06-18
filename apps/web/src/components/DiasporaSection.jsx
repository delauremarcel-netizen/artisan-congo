import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Smartphone, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import ButtonSecondary from '@/components/ButtonSecondary.jsx';

const DiasporaSection = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Gérez vos travaux au Congo depuis l'étranger</h2>
          <p className="text-lg text-muted-foreground">
            Suivi à distance, communication simplifiée, transparence totale.
          </p>
        </div>

        {/* 2+1 Bento Layout to avoid generic 3-card grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Large Feature Card (Spans 2 columns on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-background rounded-3xl p-8 md:p-10 shadow-sm border border-border flex flex-col justify-center group hover:shadow-md transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Suivi à distance</h3>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Vous résidez à l'étranger et souhaitez faire construire ou rénover au Congo ? Nous coordonnons vos chantiers sur place. Recevez des rapports réguliers, des photos et des vidéos de l'avancement de vos travaux sans avoir à vous déplacer.
            </p>
          </motion.div>

          {/* Small Feature Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col group hover:shadow-md transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Communication simplifiée</h3>
            <p className="text-muted-foreground leading-relaxed">
              Un interlocuteur unique dédié à votre projet. Échangez facilement via WhatsApp ou par email selon votre fuseau horaire.
            </p>
          </motion.div>

          {/* Small Feature Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col group hover:shadow-md transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Transparence totale</h3>
            <p className="text-muted-foreground leading-relaxed">
              Devis détaillés, facturation claire et paiements sécurisés. Vous gardez le contrôle total sur votre budget à chaque étape.
            </p>
          </motion.div>

          {/* CTA Area spanning full width */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <ButtonSecondary asChild className="w-full sm:w-auto h-14 px-8 text-base">
              <Link to="/contact">Demander un devis</Link>
            </ButtonSecondary>
            <ButtonSecondary asChild className="w-full sm:w-auto h-14 px-8 text-base">
              <Link to="/contact">Recevoir un rappel</Link>
            </ButtonSecondary>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DiasporaSection;