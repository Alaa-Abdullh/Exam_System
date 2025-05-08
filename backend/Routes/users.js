const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const { getAll, save, login } = require("../Controllers/authController");
const authController = require("../Controllers/authController");
const {validation} = require("../middlewares/validation"); 
const  registerSchema  = require("../validation/register.validation");       

router.get("/users", auth, restrictTo("admin"), authController.getAll);

router.post("/register", validation(registerSchema), save);
router.post("/login", login); 



module.exports = router;
