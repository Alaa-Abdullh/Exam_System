const mongoose=require('mongoose');

const examSchema=mongoose.Schema({
title:{
    type:String,
    require:true
},
description:String,
duration:Number,
createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
 }

},{ timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
