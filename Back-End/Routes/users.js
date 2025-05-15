const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const { getAll, save, login } = require("../controllers/authController");
// const authController = require("../Controllers/authController");
const {validation} = require("../middlewares/validation"); 
const  registerSchema  = require("../validation/register.validation");       

// Admin routes
router.get("/users", auth, restrictTo("admin"), getAll);

// Auth routes
router.post("/register", validation(registerSchema), save);
router.post("/login", login); 
// router.post("/admin/login", login);

module.exports = router;
