const Question=require('../models/Question');

// create question
exports.createQuestion=async (req,res)=>{
try{
const question=await new Question(req.body).save();
res.status(200).json(question);
}
catch(err){
    res.status(500).json({message:err.message});

}
};

// update question 
exports.UpdateQuestion=async (req,res)=>{
    try{
    const question=await  Question.findByIdAndUpdate(req.params.id,req.body,{ new: true } );

    res.status(200).json(question);
    }
    catch(err){
        res.status(500).json({message:err.message});
    
    }
    };


// delete question 
exports.deleteQuestion=async (req,res)=>{
        try{
        await Question.findByIdAndDelete(req.params.id);
         
        res.status(200).json({message:"question deleted Successful"});
        }
        catch(err){
            res.status(500).json({message:err.message});
        
        }
        };

// get question 
exports.getQuestion=async (req,res)=>{
            try{
            const questions=await  Question.find({exam:req.params.examid});
             
            res.status(200).json(questions);
            }
            catch(err){
                res.status(500).json({message:err.message});
            
            }
            };