const express=require('express');
const router=express.Router();
const {createQuestion,UpdateQuestion,deleteQuestion,getQuestion}=require('../controllers/Question');
const { auth, restrictTo } = require("../middlewares/auth");



router.post('/',auth, restrictTo("admin"),createQuestion);
router.put('/:id',auth, restrictTo("admin"),UpdateQuestion);
router.delete('/:id',auth, restrictTo("admin"),deleteQuestion);
router.get('/:examid',auth, restrictTo("admin"),getQuestion);


module.exports=router;
