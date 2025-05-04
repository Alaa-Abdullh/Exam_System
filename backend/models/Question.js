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
}
},{ timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
