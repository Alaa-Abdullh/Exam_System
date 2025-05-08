const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(express.json());
const dotenv=require('dotenv')
dotenv.config()
const usersRouter=require('./Routes/users')

const mongoose = require('mongoose');
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
mongoose.connect('mongodb://localhost:27017/Exam-System', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
.then(() => {
  console.log("Database connected successfully");
})
.catch((err) => {
  console.log("Database connection error: ", err);
});
app.use(express.json());  


app.use('/users', usersRouter)

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
