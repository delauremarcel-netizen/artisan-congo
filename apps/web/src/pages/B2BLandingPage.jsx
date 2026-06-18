import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, BarChart3, FileText, Headphones as HeadphonesIcon, Settings, Building2, Utensils, Home, Briefcase, Store, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead.jsx';

const B2BLandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEOHead 
        title="Artisan Congo pour Entreprises | B2B" 
        description="Gestion complète de vos interventions et maintenance pour les entreprises, hôtels, et résidences." 
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Modern corporate office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-sm font-semibold tracking-wider mb-6">
              ARTISAN CONGO B2B
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6" style={{letterSpacing: '-0.02em'}}>
              Gestion complète de vos interventions et maintenance.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
              Centralisez vos demandes de travaux, suivez vos chantiers en temps réel et simplifiez votre facturation avec notre réseau d'artisans certifiés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base h-14 px-8" asChild>
                <Link to="/b2b/signup">Demander une démo</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base h-14 px-8 bg-transparent text-white border-white/30 hover:bg-white/10" asChild>
                <Link to="/b2b/login">Espace Client</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir notre solution B2B ?</h2>
            <p className="text-muted-foreground text-lg">Une plateforme pensée pour les exigences des professionnels.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Artisans vérifiés", desc: "Un réseau de professionnels rigoureusement sélectionnés et notés." },
              { icon: Clock, title: "Interventions rapides", desc: "Des délais d'intervention garantis selon vos niveaux de priorité." },
              { icon: BarChart3, title: "Suivi temps réel", desc: "Tableau de bord centralisé pour suivre l'avancement de vos chantiers." },
              { icon: FileText, title: "Facturation automatique", desc: "Centralisation et dématérialisation de toutes vos factures." },
              { icon: HeadphonesIcon, title: "Support 24/7", desc: "Un gestionnaire de compte dédié pour les urgences." },
              { icon: Settings, title: "Contrats maintenance", desc: "Gestion automatisée de vos entretiens récurrents." }
            ].map((feature, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <Card className="p-6 h-full border-none shadow-sm hover:shadow-md transition-shadow bg-card">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases (Bento Grid Style) */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Adapté à votre secteur</h2>
            <p className="text-muted-foreground text-lg">Des solutions sur-mesure pour chaque type d'établissement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
            <Card className="col-span-1 md:col-span-2 row-span-2 p-8 bg-slate-900 text-white border-none flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" alt="Hotels" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="relative z-20">
                <Building2 className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Hôtels & Resorts</h3>
                <p className="text-slate-300">Maintenance préventive des chambres et interventions d'urgence 24/7 pour l'excellence du service client.</p>
              </div>
            </Card>

            <Card className="col-span-1 md:col-span-2 row-span-1 p-6 bg-card border border-border flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Utensils className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Restaurants</h3>
                <p className="text-muted-foreground text-sm">Dépannage express pour équipements de cuisine et plomberie.</p>
              </div>
            </Card>

            <Card className="col-span-1 md:col-span-1 row-span-1 p-6 bg-card border border-border flex flex-col justify-center">
              <Home className="w-8 h-8 mb-4 text-blue-600" />
              <h3 className="text-lg font-bold mb-1">Agences immobilières</h3>
              <p className="text-muted-foreground text-sm">Gestion des parcs locatifs.</p>
            </Card>

            <Card className="col-span-1 md:col-span-1 row-span-1 p-6 bg-card border border-border flex flex-col justify-center">
              <Briefcase className="w-8 h-8 mb-4 text-emerald-600" />
              <h3 className="text-lg font-bold mb-1">Entreprises</h3>
              <p className="text-muted-foreground text-sm">Aménagement et entretien de bureaux.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Des forfaits transparents</h2>
            <p className="text-muted-foreground text-lg">Choisissez le plan adapté au volume de vos besoins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="p-8 flex flex-col h-full bg-card">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Gratuit</span>
              </div>
              <p className="text-muted-foreground mb-6">Pour les petites structures avec des besoins ponctuels.</p>
              <ul className="space-y-4 mb-8 flex-1">
                {['Accès au réseau d\'artisans', 'Demandes de devis illimitées', 'Paiement à l\'intervention', 'Support standard'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/b2b/signup">Créer un compte</Link>
              </Button>
            </Card>

            {/* Pro */}
            <Card className="p-8 flex flex-col h-full bg-primary text-primary-foreground relative transform md:-translate-y-4 shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                Recommandé
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Sur devis</span>
                <span className="text-primary-foreground/70"> /mois</span>
              </div>
              <p className="text-primary-foreground/80 mb-6">Pour la gestion multi-sites et les contrats de maintenance.</p>
              <ul className="space-y-4 mb-8 flex-1">
                {['Gestion jusqu\'à 10 sites', 'Contrats de maintenance préventive', 'Facturation mensuelle centralisée', 'Interventions prioritaires', 'Support téléphonique dédié'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                <Link to="/b2b/signup">Contacter les ventes</Link>
              </Button>
            </Card>

            {/* Enterprise */}
            <Card className="p-8 flex flex-col h-full bg-card">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Sur mesure</span>
              </div>
              <p className="text-muted-foreground mb-6">Volume important et intégration système spécifique.</p>
              <ul className="space-y-4 mb-8 flex-1">
                {['Sites illimités', 'SLA personnalisés (H+2)', 'API & Intégration ERP', 'Chef de projet dédié', 'Rapports BI personnalisés'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Prendre RDV</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Ils nous font confiance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Lucia Torres", role: "Directrice d'Hôtel", company: "Meridian Resort", quote: "Depuis que nous utilisons Artisan Congo B2B, le temps de résolution de nos problèmes techniques a été divisé par trois. La facturation centralisée est un vrai soulagement." },
              { name: "Kwame Asante", role: "Facility Manager", company: "Nexus Tech", quote: "Une plateforme très intuitive. Le fait d'avoir accès à des artisans évalués et fiables en quelques clics nous permet de nous concentrer sur notre cœur de métier." },
              { name: "Maya Chen", role: "Gérante", company: "Coastal Roasters", quote: "Pour notre chaîne de cafés, la rapidité d'intervention est vitale. Le support 24/7 et la qualité des plombiers et électriciens du réseau sont exceptionnels." }
            ].map((t, i) => (
              <Card key={i} className="p-8 bg-muted/30 border-none">
                <div className="flex gap-1 text-secondary mb-6">
                  {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <blockquote className="text-lg leading-relaxed mb-8">"{t.quote}"</blockquote>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}, {t.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-slate-950 text-white text-center">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Prêt à optimiser la gestion de vos installations ?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Rejoignez les dizaines d'entreprises qui font déjà confiance à notre réseau pour leurs travaux et leur maintenance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-base" asChild>
              <Link to="/b2b/signup">Créer un compte professionnel</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:text-white" asChild>
              <Link to="/contact">Contacter notre équipe</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default B2BLandingPage;