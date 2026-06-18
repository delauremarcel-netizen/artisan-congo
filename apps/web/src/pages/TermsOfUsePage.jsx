import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 pb-20">
      <Helmet>
        <title>Conditions Générales d'Utilisation | ArtisanCongo</title>
        <meta name="description" content="Conditions générales d'utilisation de la plateforme ArtisanCongo pour les clients et les professionnels." />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl flex-1">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12">
          <header className="mb-12 text-center md:text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Dernière mise à jour : 30 Avril 2026
            </p>
          </header>

          <article className="prose-legal">
            <p className="text-lg text-foreground/90 font-medium">
              Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès et l'utilisation de la plateforme ArtisanCongo. En naviguant sur ce site ou en créant un compte, vous acceptez pleinement et sans réserve ces conditions.
            </p>

            <h2>1. Description du Service</h2>
            <p>
              ArtisanCongo est un service numérique d'intermédiation dont l'objectif est de mettre en relation des particuliers ou entreprises (les « Clients ») avec des professionnels du bâtiment et des services (les « Artisans »). 
              ArtisanCongo n'intervient pas dans la réalisation des prestations, ne fixe pas les tarifs et n'est pas partie au contrat conclu entre le Client et l'Artisan.
            </p>

            <h2>2. Accès et Inscription</h2>
            <p>
              L'accès à la recherche d'artisans est libre. Cependant, pour publier un avis ou demander un devis, la création d'un compte peut être requise. L'inscription en tant qu'Artisan est soumise à un processus de vérification strict par nos équipes.
            </p>
            <ul>
              <li>Les utilisateurs doivent être âgés d'au moins 18 ans.</li>
              <li>Les informations fournies lors de l'inscription doivent être exactes, complètes et maintenues à jour.</li>
              <li>Chaque utilisateur est responsable de la sécurité de ses identifiants de connexion.</li>
            </ul>

            <h2>3. Engagements des Utilisateurs</h2>
            
            <h3>Pour les Clients :</h3>
            <ul>
              <li>Fournir des descriptions de projets claires et honnêtes pour l'établissement des devis.</li>
              <li>Respecter les engagements pris avec les artisans (horaires de rendez-vous, conditions de paiement).</li>
              <li>Publier des avis objectifs, respectueux et fondés sur une expérience réelle. Les propos diffamatoires sont strictement interdits.</li>
            </ul>

            <h3>Pour les Artisans :</h3>
            <ul>
              <li>Posséder les qualifications et les autorisations légales nécessaires pour exercer leur métier au Congo.</li>
              <li>Fournir des devis transparents et respecter les prix et délais convenus avec le Client.</li>
              <li>Réaliser les prestations selon les règles de l'art et les normes de sécurité en vigueur.</li>
              <li>Mettre à jour régulièrement leur statut de disponibilité sur la plateforme.</li>
            </ul>

            <h2>4. Activités Interdites</h2>
            <p>Il est strictement interdit sur ArtisanCongo de :</p>
            <ul>
              <li>Créer de faux profils ou usurper l'identité d'un tiers.</li>
              <li>Publier des contenus offensants, discriminatoires ou illégaux.</li>
              <li>Utiliser la plateforme pour du démarchage non sollicité (spam).</li>
              <li>Contourner les systèmes de sécurité de la plateforme.</li>
            </ul>

            <h2>5. Tarification et Paiement</h2>
            <p>
              L'utilisation de base d'ArtisanCongo est gratuite pour les Clients. Les Artisans peuvent opter pour des formules d'abonnement pour augmenter leur visibilité. 
              Les transactions financières liées aux prestations de service s'effectuent <strong>directement entre le Client et l'Artisan</strong>. ArtisanCongo ne prend aucune commission sur ces transactions.
            </p>

            <h2>6. Limitation de Responsabilité</h2>
            <p>
              En sa qualité de simple intermédiaire technique, ArtisanCongo ne garantit pas l'exactitude absolue des informations publiées par les utilisateurs. Nous ne saurions être tenus responsables :
            </p>
            <ul>
              <li>De la qualité, de la conformité ou des retards dans l'exécution des travaux par les Artisans.</li>
              <li>Des litiges financiers entre Clients et Artisans.</li>
              <li>Des dommages directs ou indirects résultant d'une prestation mise en relation via la plateforme.</li>
            </ul>

            <h2>7. Modification des Conditions</h2>
            <p>
              ArtisanCongo se réserve le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des modifications substantielles par e-mail ou par une notification sur le site. L'utilisation continue de la plateforme après modification vaut acceptation des nouvelles conditions.
            </p>

            <h2>8. Droit Applicable et Résolution des Litiges</h2>
            <p>
              Ces conditions sont régies par les lois en vigueur en République du Congo. En cas de litige entre un utilisateur et ArtisanCongo, une solution amiable sera privilégiée. À défaut d'accord, les tribunaux compétents de Brazzaville seront seuls saisis.
            </p>

            <h2>9. Contact</h2>
            <p>
              Pour toute réclamation, signalement d'un comportement abusif ou question relative à ces CGU, veuillez nous contacter :
            </p>
            <ul className="list-none pl-0 border-l-4 border-primary pl-4 py-2 my-6 bg-muted/30">
              <li><strong>Email :</strong> legal@artisancongo.com</li>
              <li><strong>Téléphone :</strong> Service disponible via WhatsApp sur notre plateforme</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;