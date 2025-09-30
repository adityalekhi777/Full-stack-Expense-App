const Expense = require('../Models/expenseModel');
const User = require('../Models/userModel');

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

        // Update total expenses for the user
        await User.findByIdAndUpdate(req.user.id, { $inc: { totalExpenses: amount } });

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

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update total expenses for the user
        await User.findByIdAndUpdate(req.user.id, { $inc: { totalExpenses: -expense.amount } });

        await expense.remove();

        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const amountDifference = amount - expense.amount;

        // Update total expenses for the user
        await User.findByIdAndUpdate(req.user.id, { $inc: { totalExpenses: amountDifference } });

        expense.amount = amount;
        expense.description = description;
        expense.category = category;

        await expense.save();

        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
