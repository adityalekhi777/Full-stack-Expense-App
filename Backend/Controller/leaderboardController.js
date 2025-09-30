const User = require('../Models/userModel');

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ totalExpenses: -1 }).select('-password');
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
