import './LinkCard.css';

interface LinkCardProps {
    id: string;
    title: string;
    url: string;
    icon?: string;
    index: number;
    displayType?: 'list' | 'card' | null;
    thumbnailUrl?: string | null;
}

export default function LinkCard({ title, url, index, displayType = 'list', thumbnailUrl }: LinkCardProps) {
    const cardType = displayType === 'card' ? 'card' : 'list';

    return (
        <a
            href={url}
            className={`link-card link-card--${cardType}`}
            target="_blank"
            rel="noreferrer"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {cardType === 'card' && (
                <div className="link-thumbnail" aria-hidden="true">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="link-thumbnail-empty">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    )}
                </div>
            )}
            <div className="link-content">
                <span className="link-title">{title}</span>
                <span className="link-arrow" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7"></path>
                        <path d="M7 7h10v10"></path>
                    </svg>
                </span>
            </div>
        </a>
    )
}
