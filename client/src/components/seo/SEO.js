import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'FoodForce Maroc | Emploi Restauration, Hôtellerie et Événementiel',
  description = 'La plateforme de recrutement spécialisée dans les secteurs de la restauration, hôtellerie, événementiel, vente et logistique au Maroc. Trouvez votre prochain emploi ou recrutez les meilleurs talents.',
  keywords = 'emploi restauration maroc, recrutement hôtellerie, jobs événementiel, offres d\'emploi maroc',
  canonicalUrl = '',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  children,
}) => {
  const siteUrl = 'https://foodforce.ma';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const fullOgImageUrl = `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Balises meta de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Balises Open Graph pour Facebook, LinkedIn, etc. */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="FoodForce Maroc" />
      <meta property="og:locale" content="fr_FR" />

      {/* Balises Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />

      {/* Balises supplémentaires pour les moteurs de recherche */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="FoodForce Maroc" />

      {/* Contenu supplémentaire si nécessaire */}
      {children}
    </Helmet>
  );
};

export default SEO;
