const Expense = require('../Models/expenseModel');

exports.createExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const expense = new Expense({
            user: req.user.id,
            amount,
            description,
            category
        });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
