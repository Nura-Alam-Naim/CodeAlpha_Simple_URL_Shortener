import React, { useContext } from 'react';
import { LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="header">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="logo">
                        <LinkIcon className="gradient-text" size={28} />
                        <span className="gradient-text">URL Shortener</span>
                    </div>
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <span style={{ marginRight: '1rem', color: 'var(--text-muted)' }}>Welcome, {user.username}</span>
                            <button onClick={logout} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', marginRight: '0.5rem' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
