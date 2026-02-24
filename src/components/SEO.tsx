import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  ogType?: string;
  twitterCard?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords = "racun, link affiliate, bio link, link management", 
  image = "/og-image.png",
  canonical = typeof window !== 'undefined' ? window.location.href : "",
  ogType = "website",
  twitterCard = "summary_large_image"
}: SEOProps) {
  const fullTitle = `${title} | Racun Link`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
