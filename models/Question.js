const mongoose=require('mongoose');

const questionSchema=mongoose.Schema({
exam: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Exam',
    require:true
}    ,
questionsText:{
    type:String,
    require:true
},
Answer:[String],
correctAnswer:{
    type:String,
    require:true
},
 createdAt:Date,
 updatedAt:Date,
});

module.exports = mongoose.model('Question', questionSchema);
