const fs = require("fs");
const mongoose = require("mongoose");
const userModel = require("../models/users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");


exports.getAll = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(201).json({ status: "success", data: users });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};


exports.save = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, roles } = req.body;

    if (!username || !firstName || !lastName || !email || !password || !roles) {
      return res.status(400).json({ status: "fail", message: "missing fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ status: "fail", message: "Password must be at least 6 characters" });
    }

    // ✅ 1. تحقق من عدم تكرار المستخدم
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: "fail", message: "User already exists" });
    }

    // ✅ 2. إنشاء المستخدم (سيتم تشفير كلمة المرور تلقائياً في pre-save hook)
    const user = await userModel.create({
      username,
      firstName,
      lastName,
      email,
      password,
      roles
    });

    res.status(201).json({ status: "success", data: user });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};



exports.login = async function (req, res) {
  try {
    let { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "you must provide email and password" });
    }

    let user = await userModel.findOne({ email });
    console.log('User found:', {
      id: user?._id,
      email: user?.email,
      roles: user?.roles
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "invalid email or password" });
    }

    // Log the stored hashed password for debugging
    console.log('Stored hashed password:', user.password);
    
    try {
      let isValid = await bcryptjs.compare(password, user.password);
      console.log('Password comparison:', {
        providedPassword: password,
        isValid: isValid
      });

      if (!isValid) {
        return res
          .status(400)
          .json({ status: "fail", message: "invalid email or password" });
      }

      let token = jwt.sign(
        { id: user._id, email: user.email, roles: user.roles },
        process.env.Secret,
        { expiresIn: '1week' }
      );


      res.status(200).json({ 
        status: "success", 
        data: { 
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles
          }
        } 
      });
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return res
        .status(500)
        .json({ status: "fail", message: "Error comparing passwords" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: "fail", message: "An error occurred during login" });
  }
};