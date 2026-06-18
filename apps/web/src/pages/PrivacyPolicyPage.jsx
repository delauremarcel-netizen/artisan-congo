import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 pb-20">
      <Helmet>
        <title>Politique de Confidentialité | ArtisanCongo</title>
        <meta name="description" content="Découvrez comment ArtisanCongo collecte, utilise et protège vos données personnelles conformément au RGPD." />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl flex-1">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12">
          <header className="mb-12 text-center md:text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Dernière mise à jour : 30 Avril 2026
            </p>
          </header>

          <article className="prose-legal">
            <p className="text-lg text-foreground/90 font-medium">
              Chez ArtisanCongo, nous accordons une importance primordiale à la protection de vos données personnelles. Cette politique détaille comment nous collectons, utilisons, partageons et protégeons vos informations en conformité avec les standards internationaux de protection des données (RGPD).
            </p>

            <h2>1. Collecte des Données</h2>
            <p>Nous collectons les données suivantes lorsque vous utilisez notre plateforme :</p>
            <ul>
              <li><strong>Données d'identification :</strong> Nom, prénom, adresse e-mail, numéro de téléphone.</li>
              <li><strong>Données professionnelles (Artisans) :</strong> Métier, années d'expérience, photos de réalisations, zone géographique, documents d'identification pour la vérification.</li>
              <li><strong>Données de transaction :</strong> Historique des demandes de devis, avis publiés, paiements (via nos prestataires de Mobile Money).</li>
              <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, cookies de session et d'analyse.</li>
            </ul>

            <h2>2. Utilisation des Données</h2>
            <p>Vos données sont utilisées exclusivement pour les finalités suivantes :</p>
            <ul>
              <li>Mettre en relation les clients et les artisans qualifiés.</li>
              <li>Vérifier l'identité et les qualifications des professionnels inscrits.</li>
              <li>Communiquer avec vous (notifications de devis, messages via notre intégration WhatsApp).</li>
              <li>Améliorer et personnaliser votre expérience sur notre plateforme.</li>
              <li>Assurer la sécurité et prévenir les fraudes.</li>
            </ul>

            <h2>3. Partage et Transfert</h2>
            <p>Nous ne vendons <strong>jamais</strong> vos données personnelles. Elles peuvent être partagées uniquement dans les contextes suivants :</p>
            <ul>
              <li><strong>Entre utilisateurs :</strong> Les informations de contact sont partagées entre un client et un artisan lorsqu'une mise en relation est acceptée.</li>
              <li><strong>Prestataires tiers :</strong> Nous utilisons des services sécurisés pour l'hébergement (Cloud), le paiement (Mobile Money) et la communication (WhatsApp Business API). Ces partenaires sont strictement tenus à la confidentialité.</li>
              <li><strong>Obligations légales :</strong> Si la loi l'exige ou pour répondre à une procédure judiciaire valide.</li>
            </ul>

            <h2>4. Vos Droits (Conformité RGPD)</h2>
            <p>En tant qu'utilisateur, vous disposez de droits étendus concernant vos données :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> Vous pouvez demander une copie des données que nous détenons sur vous.</li>
              <li><strong>Droit de rectification :</strong> Vous pouvez corriger des informations inexactes depuis votre espace profil.</li>
              <li><strong>Droit à l'effacement (Droit à l'oubli) :</strong> Vous pouvez exiger la suppression définitive de votre compte et de vos données.</li>
              <li><strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré.</li>
              <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données pour le marketing direct.</li>
            </ul>

            <h2>5. Sécurité et Conservation</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles (chiffrement des données, accès restreint) pour protéger vos informations contre toute perte ou accès non autorisé. 
              Vos données sont conservées aussi longtemps que votre compte est actif. Si vous supprimez votre compte, vos données personnelles sont effacées de nos bases actives dans un délai de 30 jours, à l'exception des données nécessaires pour satisfaire à nos obligations légales (ex: comptabilité).
            </p>

            <h2>6. Politique des Cookies</h2>
            <p>
              ArtisanCongo utilise des cookies essentiels pour le fonctionnement du site (authentification, session) et des cookies analytiques pour comprendre l'utilisation de la plateforme. Vous pouvez gérer vos préférences en matière de cookies directement depuis les paramètres de votre navigateur.
            </p>

            <h2>7. Contact et Demandes liées aux Données</h2>
            <p>
              Pour toute question concernant cette politique ou pour exercer vos droits, vous pouvez contacter notre Délégué à la Protection des Données (DPO) :
            </p>
            <ul className="list-none pl-0 border-l-4 border-primary pl-4 py-2 my-6 bg-muted/30">
              <li><strong>Email :</strong> privacy@artisancongo.com</li>
              <li><strong>Adresse postale :</strong> Centre d'Affaires, Brazzaville, République du Congo</li>
            </ul>
            <p>
              Nous nous engageons à répondre à toute demande d'exercice de droits dans un délai maximum de 30 jours.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;