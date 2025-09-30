const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense, updateExpense } = require('../Controller/expenseController');
const { protect } = require('../Middleware/authMiddleware');

router.route('/').post(protect, createExpense).get(protect, getExpenses);
router.route('/:id').delete(protect, deleteExpense).put(protect, updateExpense);

module.exports = router;
