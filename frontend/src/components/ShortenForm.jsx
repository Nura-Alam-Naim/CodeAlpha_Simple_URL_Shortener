import React, { useState } from 'react';
import { Link, Wand2 } from 'lucide-react';

const ShortenForm = ({ onShorten, isLoading }) => {
    const [url, setUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [expiresInDays, setExpiresInDays] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onShorten({ url, customCode, expiresInDays });
    };

    return (
        <div className="glass-panel animate-fade-in">
            <h2>Shorten your link</h2>
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
