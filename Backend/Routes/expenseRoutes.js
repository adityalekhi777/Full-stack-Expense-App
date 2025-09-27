const express = require('express');
const router = express.Router();
const { createExpense, getExpenses } = require('../Controller/expenseController');
const { protect } = require('../Middleware/authMiddleware');

router.route('/').post(protect, createExpense).get(protect, getExpenses);

module.exports = router;
