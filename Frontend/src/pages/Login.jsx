import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function changeHandler(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function submitHandler(e) {
        e.preventDefault();
        setError(null); // Reset error on new submission

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            //If the request failed the data will the reason why

            if (!res.ok) {
                throw new Error(data.message || `HTTP error! Status: ${res.status}`);
            }

            setError({ type: "success", message: data.message });
        } catch (err) {
            setError({ type: "error", message: err.message });
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.form}>
                <h2>Login</h2>
                
                <label className={styles.label}>
                    Email:
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={changeHandler}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    Password:
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={changeHandler}
                        className={styles.input}
                    />
                </label>
                <button type='submit' className={styles.button}>Login</button>
                <button type="button" onClick={() => navigate('/signup')} className={styles.toggle_button}>
                    New User, Sign Up
                </button>
            </form>
            {error && <div className={error.type === 'success' ? styles.success : styles.error}>{error.message}</div>}
        </div>
    );
}