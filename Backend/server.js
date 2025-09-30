require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./Routes/authRoutes')
const expenseRoutes = require('./Routes/expenseRoutes')
const leaderboardRoutes = require('./Routes/leaderboardRoutes')

app.use(cors())
app.use(express.json())


app.use('/api/auth',authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../Frontend/dist', 'index.html'));
// })

// console.log(path.resolve(__dirname, '../Frontend/dist', 'index.html'));

// Centralized error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); 
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });
});


mongoose.connect(process.env.MONGO_URI)
.then(()=>{

    app.listen(process.env.PORT,()=>{
        console.log("Data Base and Server are running")
    })
    
})

