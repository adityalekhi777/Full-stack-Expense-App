import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    async function submitHandler(e) {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost:3000/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setMessage('Password reset link has been sent to your email.');

        } catch (err) {
            setMessage(err.message);
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.form}>
                <h2>Forgot Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                
                <label className={styles.label}>
                    Email:
                    <input
                        type='email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                
                <button type='submit' className={styles.button}>Submit</button>
                <button type="button" onClick={() => navigate('/login')} className={styles.toggle_button}>
                    Back to Login
                </button>
            </form>
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
}
