const express=require('express');
const router=express.Router();
const {createQuestion,UpdateQuestion,deleteQuestion,getQuestion}=require('../controllers/Question');


router.post('/',createQuestion);
router.put('/:id',UpdateQuestion);
router.delete('/:id',deleteQuestion);
router.get('/:examid',getQuestion);


module.exports=router;
