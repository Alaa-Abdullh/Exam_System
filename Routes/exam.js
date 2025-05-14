const express=require('express');
const router=express.Router();
const {createExam,UpdateExam,deleteExam,getExam}=require('../controllers/Exam');
const { auth, restrictTo } = require("../middlewares/auth");




router.post('/', auth, restrictTo("admin"),createExam);
router.get('/', auth, restrictTo("admin"),getExam);

router.put('/:id', auth, restrictTo("admin"),UpdateExam);
router.delete('/:id', auth, restrictTo("admin"),deleteExam);


module.exports=router;
