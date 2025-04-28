const mongoose=require('mongoose');

const resultSchema=mongoose.Schema({
exam: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Exam',
    require:true
}    ,
studentid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true
},
score:{
    type:Number,
    require:true
},
totalQuestion:{
    type:Number,
    require:true
},
correctAnswer:{
    type:String,
    require:true
},
 createdAt:Date,
 updatedAt:Date,
});

module.exports = mongoose.model('Result', resultSchema);
