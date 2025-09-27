
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import styles from './Home.module.css';

export default function Home() {
    const { user, token } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Food');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/expenses', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        if (token) {
            fetchExpenses();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, description, category })
            });
            const newExpense = await response.json();
            setExpenses([...expenses, newExpense]);
            setAmount('');
            setDescription('');
            setCategory('Food');
        } catch (error) {
            console.error('Error creating expense:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Welcome to the Home Page!</h1>
            <p>This is a protected area of the application.</p>
            {user && <p>You are logged in as {user.name}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Add Expense</h2>
                <div>
                    <label>Amount:</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Food">Food</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Salary">Salary</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button type="submit">Add Expense</button>
            </form>

            <ExpenseList expenses={expenses} />
        </div>
    );
}