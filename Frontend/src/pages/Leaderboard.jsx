import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/leaderboard', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard', error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className={styles.container}>
            <h1>Leaderboard</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Total Expenses</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.totalExpenses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
