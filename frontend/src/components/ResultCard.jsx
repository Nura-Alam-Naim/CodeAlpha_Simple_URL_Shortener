import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const ResultCard = ({ result }) => {
    const [copied, setCopied] = React.useState(false);

    if (!result) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(result.shortUrl);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-panel result-card animate-fade-in">
            <h3>Your Shortened URL</h3>
            
            {result.qrCode && (
                <div className="qr-code-container">
                    <img src={result.qrCode} alt="QR Code" />
                </div>
            )}
            
            <div className="short-url-display">
                <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="short-url-text">
                    {result.shortUrl}
                </a>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleCopy} className="btn-icon" title="Copy to clipboard">
                        {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                    </button>
                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Open in new tab">
                        <ExternalLink size={18} />
                    </a>
                </div>
            </div>
            
            {result.expiresAt && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Expires on: {new Date(result.expiresAt).toLocaleDateString()}
                </p>
            )}
        </div>
    );
};

export default ResultCard;
