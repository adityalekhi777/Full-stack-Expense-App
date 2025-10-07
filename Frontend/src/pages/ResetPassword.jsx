import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function submitHandler(e) {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
             {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setMessage('Password has been reset successfully. You can now login with your new password.');
            setTimeout(() => navigate('/login'), 3000);

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.form}>
                <h2>Reset Password</h2>
                
                <label className={styles.label}>
                    New Password:
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Confirm New Password:
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                
                <button type='submit' className={styles.button}>Reset Password</button>
            </form>
            {message && <div className={styles.message}>{message}</div>}
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
}
