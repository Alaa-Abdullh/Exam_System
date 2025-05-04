const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const dotenv=require('dotenv')
dotenv.config()
const usersRouter=require('./Routes/users')
const examRouter=require('./Routes/exam')
const resultRouter=require('./Routes/result')

const questionRouter=require('./Routes/question')
const mongoose = require('mongoose');

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
app.use('/exam', examRouter)
app.use('/result', resultRouter)

app.use('/question', questionRouter)

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
