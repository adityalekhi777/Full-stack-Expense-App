import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Reusing styles from Login

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        if (formData.password !== formData.confirmPassword) {
            setError({ type: "error", message: "Passwords do not match." });
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;
            const res = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const data = await res.json();

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
                <h2>Sign Up</h2>
                
                <label className={styles.label}>
                    Name:
                    <input type='text' name='name' value={formData.name} onChange={changeHandler} className={styles.input} required />
                </label>
                <label className={styles.label}>
                    Email:
                    <input type='email' name='email' value={formData.email} onChange={changeHandler} className={styles.input} required />
                </label>
                <label className={styles.label}>
                    Password:
                    <input type='password' name='password' value={formData.password} onChange={changeHandler} className={styles.input} required />
                </label>
                <label className={styles.label}>
                    Confirm Password:
                    <input type='password' name='confirmPassword' value={formData.confirmPassword} onChange={changeHandler} className={styles.input} required />
                </label>
                <button type='submit' className={styles.button}>Sign Up</button>
                <button type="button" onClick={() => navigate('/login')} className={styles.toggle_button}>
                    Already a user? Login
                </button>
            </form>
            {error && <div className={error.type === 'success' ? styles.success : styles.error}>{error.message}</div>}
        </div>
    );
}
