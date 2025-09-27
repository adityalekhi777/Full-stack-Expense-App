
import React from 'react';
import styles from './ExpenseList.module.css';

const ExpenseList = ({ expenses }) => {
    return (
        <div className={styles.container}>
            <h2>Your Expenses</h2>
            <ul className={styles.list}>
                {expenses.map(expense => (
                    <li key={expense._id} className={styles.item}>
                        <div className={styles.itemHeader}>
                            <strong>{expense.description}</strong>
                            <span>₹{expense.amount}</span>
                        </div>
                        <div className={styles.itemFooter}>
                            <span>{expense.category}</span>
                            <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;
