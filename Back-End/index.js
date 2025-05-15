const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Exam = require('./models/Exam');
require('dotenv').config();

// routes
const usersRouter = require('./Routes/users');
const examroutes = require('./Routes/exam');
const questionroutes = require('./Routes/question');
const resultroutes = require('./Routes/result');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', usersRouter); // Authentication routes
app.use('/api/exams', examroutes);
app.use('/api/questions', questionroutes);
app.use('/api/results', resultroutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'fail',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
