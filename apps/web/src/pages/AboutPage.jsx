import React from 'react';
import { Helmet } from 'react-helmet';
import { Target, Eye, Heart, ShieldCheck, Users, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-muted/20 pt-24 pb-16">
      <Helmet>
        <title>À propos de nous | ArtisanCongo</title>
        <meta name="description" content="Découvrez l'histoire, la mission et les valeurs d'ArtisanCongo, la première plateforme de mise en relation avec des artisans de confiance au Congo." />
      </Helmet>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">À propos d'ArtisanCongo</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nous avons créé ArtisanCongo avec une vision simple : faciliter la mise en relation entre les particuliers, les entreprises et les artisans qualifiés du Congo, dans un cadre de confiance, de sécurité et de transparence.
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-20 relative premium-shadow group">
          <img 
            src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000&auto=format&fit=crop" 
            alt="Équipe d'artisans au travail" 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">Valoriser le savoir-faire local</h2>
              <p className="text-white/80 max-w-2xl text-lg">Nous mettons en lumière les talents de nos villes pour construire ensemble l'avenir de nos infrastructures.</p>
            </div>
          </div>
        </div>

        {/* Vision, Mission, Valeurs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center flex flex-col items-center h-full">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Notre Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Faciliter l'accès aux services artisanaux de qualité tout en valorisant le savoir-faire local et en offrant aux professionnels un outil pour développer leur activité.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center flex flex-col items-center h-full">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Notre Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Devenir la plateforme numérique de référence incontournable pour les services à domicile et professionnels en Afrique centrale.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center flex flex-col items-center h-full">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nos Valeurs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Excellence, intégrité, innovation technologique et engagement profond envers la satisfaction de nos utilisateurs et partenaires.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Numbers/Stats */}
        <div className="bg-primary rounded-3xl p-10 md:p-16 text-primary-foreground grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center shadow-xl mb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <Users className="w-10 h-10 mb-4 opacity-80" />
            <h4 className="text-5xl font-black mb-2">+500</h4>
            <p className="text-primary-foreground/80 font-medium">Clients Satisfaits</p>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <ShieldCheck className="w-10 h-10 mb-4 opacity-80" />
            <h4 className="text-5xl font-black mb-2">+150</h4>
            <p className="text-primary-foreground/80 font-medium">Artisans Vérifiés</p>
          </div>
          <div className="relative z-10 flex flex-col items-center sm:col-span-2 md:col-span-1">
            <Wrench className="w-10 h-10 mb-4 opacity-80" />
            <h4 className="text-5xl font-black mb-2">15</h4>
            <p className="text-primary-foreground/80 font-medium">Métiers Couverts</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Pourquoi ArtisanCongo ?</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Trouver un artisan fiable, compétent et ponctuel a toujours été un défi majeur. Les recommandations par bouche-à-oreille sont souvent limitées et ne garantissent pas toujours la qualité de la prestation.
              </p>
              <p>
                Face à ce constat, nous avons créé ArtisanCongo : une solution technologique simple qui centralise les meilleurs talents locaux. Chaque artisan inscrit sur notre plateforme passe par un processus de vérification rigoureux (identité, compétences, références) pour vous assurer une tranquillité d'esprit totale.
              </p>
              <p>
                Aujourd'hui, nous sommes fiers de contribuer au développement économique local en offrant aux artisans une visibilité numérique professionnelle, tout en garantissant aux clients un service de haute qualité.
              </p>
              <p className="pt-4">
                Pour toute question, n'hésitez pas à nous contacter à <a href="mailto:contact@artisancongo.com" className="contact-link">contact@artisancongo.com</a> ou au <a href="tel:+33605884875" className="contact-link">00 33 6 05 88 48 75</a>.
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden premium-shadow h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=1000&auto=format&fit=crop" 
              alt="Artisan mesurant sur un chantier" 
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;