const Result=require('../models/Result');
const Question=require('../models/Question');


// create exam
exports.submitExam=async (req,res)=>{
try{

    const examId = req.params.examid;
    const { answers, studentid } = req.body; 

    const questions = await Question.find({ exam: examId });
    let correctCount = 0;

    // correct answar
    questions.forEach(q => {
        const studentAnswer = answers.find(a => a.questionId == q._id.toString());
        if (studentAnswer && studentAnswer.selectedAnswer === q.correctAnswer) {
          correctCount++;
        }
      });

      const totalQuestions = questions.length;
      const score = (correctCount / totalQuestions) * 100;


      const result = new Result({
        exam: examId,
        studentid,
        score,
        totalQuestion: totalQuestions,
        correctAnswer: correctCount
      });

      
    await result.save();

// const submitexam=await new Result({exam:req.params.examid,...req.body}).save();
res.status(200).json({ message: "Exam submitted successfully", score, correctAnswers: correctCount });
}
catch(err){
    res.status(500).json({message:err.message});

}
};



// get result student 
exports.getresultstudent = async (req, res) => {
    try {
      const { examid, studentid } = req.params;
  
      const result = await Result.findOne({
        exam: examid,
        studentid: studentid
      });
  
      if (!result) {
        return res.status(404).json({ message: "Result not found" });
      }
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
// :examid/submit