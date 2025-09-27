require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./Routes/authRoutes')
const expenseRoutes = require('./Routes/expenseRoutes')

app.use(cors())
app.use(express.json())
app.use('/',authRoutes)
app.use('/api/expenses', expenseRoutes)

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
        console.log("Server is running")
    })
    
})

