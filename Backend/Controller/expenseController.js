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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({ user: req.user.id }).skip(skip).limit(limit);
        const totalExpenses = await Expense.countDocuments({ user: req.user.id });
        const totalPages = Math.ceil(totalExpenses / limit);

        res.json({ expenses, totalPages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
