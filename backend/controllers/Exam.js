const Exam=require('../models/Exam');

// create exam
exports.createExam=async (req,res)=>{
try{
const exam=await new Exam(req.body).save();
res.status(200).json(exam);
}
catch(err){
    res.status(500).json({message:err.message});

}
};

// update exam 
exports.UpdateExam=async (req,res)=>{
    try{
    const exam=await  Exam.findByIdAndUpdate(req.params.id,req.body,{ new: true } ); //update 

    res.status(200).json(exam);
    }
    catch(err){
        res.status(500).json({message:err.message});
    
    }
    };


// delete exam 
exports.deleteExam=async (req,res)=>{
        try{
        await  Exam.findByIdAndDelete(req.params.id);
         
        res.status(200).json({message:"Exam deleted Successful"});
        }
        catch(err){
            res.status(500).json({message:err.message});
        
        }
        };

// get exam 
exports.getExam=async (req,res)=>{
            try{
            const exams=await  Exam.find();
             
            res.status(200).json(exams);
            }
            catch(err){
                res.status(500).json({message:err.message});
            
            }
            };