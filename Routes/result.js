const express=require('express');
const router=express.Router();
const {submitExam,getresultstudent}=require('../controllers/Result');


router.post('/:examid/submit',submitExam);
router.get('/:examid/result/:studentid', getresultstudent);




module.exports=router;
