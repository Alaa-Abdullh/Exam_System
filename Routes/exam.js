const express=require('express');
const router=express.Router();
const {createExam,UpdateExam,deleteExam,getExam}=require('../controllers/Exam');


router.post('/',createExam);
router.put('/:id',UpdateExam);
router.delete('/:id',deleteExam);
router.get('/',getExam);


module.exports=router;
