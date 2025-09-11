import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#333',
    color: 'white',
};

const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
};

const logoutButtonStyle = {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
};

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <nav style={navbarStyle}>
            <Link to="/home" style={linkStyle}><h2>ExpenseApp</h2></Link>
            <div style={navLinksStyle}>
                <button onClick={logout} style={logoutButtonStyle}>Logout</button>
            </div>
        </nav>
    );
}