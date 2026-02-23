import './LinkCard.css';

interface LinkCardProps {
    id: number;
    title: string;
    url: string;
    icon: string;
    index: number;
}

export default function LinkCard({ title, url, index }: LinkCardProps) {
    return (
        <a
            href={url}
            className="link-card"
            target="_blank"
            rel="noreferrer"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="link-content">
                <span className="link-title">{title}</span>
            </div>
        </a>
    )
}
