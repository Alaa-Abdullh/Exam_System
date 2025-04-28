const Result=require('../models/Result');

// create exam
exports.submitExam=async (req,res)=>{
try{
const submitexam=await new Result({exam:req.params.examid,...req.body}).save();
res.status(200).json(submitexam);
}
catch(err){
    res.status(500).json({message:err.message});

}
};
// :examid/submit