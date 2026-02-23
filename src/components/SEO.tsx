import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    name?: string;
    type?: string;
}

export default function SEO({ title, description, name, type }: SEOProps) {
    const defaultDesc = "Tingkatkan konversi affiliate TikTok, Shopee, dan Tokopedia dengan halaman link yang estetik, cepat, dan mudah dibagikan di bio kamu.";
    const metaDesc = description || defaultDesc;
    const siteName = name || 'Racun Link';
    const metaType = type || 'website';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={metaDesc} />

            {/* Open Graph tags (Facebook, LinkedIn, etc) */}
            <meta property="og:type" content={metaType} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={siteName} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={metaDesc} />
        </Helmet>
    );
}
