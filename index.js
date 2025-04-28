const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const Exam = require('./models/Exam');
require('dotenv').config();

const examroutes=require('./Routes/exam');
const questionroutes=require('./Routes/question');
const resultroutes=require('./Routes/result');

const app=express();
app.use(express.json());
app.use(cors());


const port = 3000

// connect db mongodb
mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("mongodb connected :)");
}).catch((err)=>{console.log("can not connect",err);
});




app.get('/',async (req,res)=>{
    res.send('Done Api runnn ')
});



// not found 
// app.use((req,res,next)=>{
//     res.status(404).json({status:'fail',message:'notfound'})
// })

// error handel middelwear 
// app.use((err,req,res,next)=>{
//     console.log(err.stack);
    
//     res.status(500).json({status:'fail',message:'error try again'})
// })





// api controller
app.use('/exams',examroutes);
app.use('/questions',questionroutes);
app.use('/results',resultroutes);

app.listen(port,()=>console.log(`server run as port ${port}`));
