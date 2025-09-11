import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome to the Home Page!</h1>
            <p>This is a protected area of the application.</p>
            {user && <p>You are logged in with user ID: {user.id}</p>}
        </div>
    );
}