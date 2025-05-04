const mongoose=require('mongoose');

const resultSchema=mongoose.Schema({
exam: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Exam',
    required:true
}    ,
studentid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
score:{
    type:Number,
    required:true
},
totalQuestion:{
    type:Number,
    required:true
},
correctAnswer:{
    type:Number,
    required:true
}
},{ timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
