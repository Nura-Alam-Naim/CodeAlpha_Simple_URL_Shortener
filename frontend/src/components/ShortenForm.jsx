import React, { useState, useContext } from 'react';
import { Link, Wand2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ShortenForm = ({ onShorten, isLoading }) => {
    const [url, setUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [expiresInDays, setExpiresInDays] = useState('');
    const { user } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        onShorten({ url, customCode, expiresInDays });
    };

    return (
        <div className="glass-panel animate-fade-in">
            <h2>Shorten your link</h2>
            {!user && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 165, 0, 0.1)', color: '#ffb347', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid rgba(255, 165, 0, 0.2)' }}>
                    <strong>Note:</strong> You are a guest. URLs are only saved to this browser session and will be lost if you clear your data. <Link to="/login" style={{ color: '#ffb347', textDecoration: 'underline' }}>Login to save permanently.</Link>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="url">Destination URL *</label>
                    <input
                        type="url"
                        id="url"
                        className="form-control"
                        placeholder="https://example.com/very/long/url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="customCode">Custom Alias (Optional)</label>
                    <input
                        type="text"
                        id="customCode"
                        className="form-control"
                        placeholder="e.g. my-campaign"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        minLength={3}
                        maxLength={10}
                        pattern="[a-zA-Z0-9]+"
                        title="Alphanumeric characters only, 3-10 length"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="expires">Expires in (Days) (Optional)</label>
                    <input
                        type="number"
                        id="expires"
                        className="form-control"
                        placeholder="e.g. 7"
                        value={expiresInDays}
                        onChange={(e) => setExpiresInDays(e.target.value)}
                        min={1}
                        max={365}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading || !url}>
                    {isLoading ? 'Shortening...' : <><Wand2 size={18} /> Shorten URL</>}
                </button>
            </form>
        </div>
    );
};

export default ShortenForm;
