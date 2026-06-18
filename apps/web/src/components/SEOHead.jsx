import React from 'react';
import { Helmet } from 'react-helmet';

export const SEOHead = ({ 
  title = 'ArtisanCongo | Trouvez les meilleurs artisans au Congo',
  description = 'La plateforme de référence pour trouver, comparer et contacter des artisans qualifiés et vérifiés au Congo Brazzaville.',
  keywords = 'artisan, congo, brazzaville, pointe-noire, travaux, devis',
  ogImage = 'https://artisancongo.cg/og-image.jpg',
  ogUrl = 'https://artisancongo.cg/'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
};