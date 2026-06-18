import React from 'react';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SEOHead } from '@/components/SEOHead.jsx';

const FAQPage = () => {
  const faqs = [
    {
      question: "Comment trouver un artisan de confiance ?",
      answer: "Utilisez notre barre de recherche pour trouver des artisans par métier et par ville. Tous nos artisans avec le badge 'Vérifié' ont passé un contrôle rigoureux de leurs qualifications et de leur identité."
    },
    {
      question: "L'inscription est-elle gratuite ?",
      answer: "Oui, l'inscription est totalement gratuite pour les particuliers (clients). Pour les artisans et les entreprises, nous proposons des formules gratuites et des abonnements premium avec plus de visibilité."
    },
    {
      question: "Comment se passe le paiement ?",
      answer: "Le paiement s'effectue directement entre vous et l'artisan, selon les modalités convenues dans le devis. ArtisanCongo ne prend pas de commission sur vos transactions directes."
    },
    {
      question: "Que faire en cas de litige avec un artisan ?",
      answer: "Si vous rencontrez un problème, essayez d'abord d'en discuter avec l'artisan. Si aucune solution n'est trouvée, vous pouvez contacter notre support client qui vous accompagnera dans les démarches de médiation."
    },
    {
      question: "Comment laisser un avis ?",
      answer: "Une fois la prestation terminée, rendez-vous sur le profil de l'artisan ou dans votre espace client pour laisser une note sur 5 et un commentaire détaillé sur la qualité du travail."
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20 pt-24 pb-20">
      <SEOHead 
        title="Foire Aux Questions (FAQ) | ArtisanCongo" 
        description="Trouvez les réponses à toutes vos questions sur le fonctionnement d'ArtisanCongo."
      />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Foire Aux Questions</h1>
          <p className="text-lg text-muted-foreground">
            Tout ce que vous devez savoir sur ArtisanCongo.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;