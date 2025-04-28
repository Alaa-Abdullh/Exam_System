const express=require('express');
const router=express.Router();
const {submitExam}=require('../controllers/Result');


router.post('/:examid/submit',submitExam);



module.exports=router;
