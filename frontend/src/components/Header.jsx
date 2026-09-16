import React from 'react';
import { LinkIcon } from 'lucide-react';

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <LinkIcon className="gradient-text" size={28} />
                    <span><span className="gradient-text">CodeAlpha</span> Shortener</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
