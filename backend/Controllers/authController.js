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

    // التأكد من وجود جميع الحقول المطلوبة
    if (!username || !firstName || !lastName || !email || !password || !roles) {
      return res.status(400).json({ status: "fail", message: "missing fields" });
    }

    // إذا كان الباسورد مكون من أقل من 6 أحرف
    if (password.length < 6) {
      return res.status(400).json({ status: "fail", message: "Password must be at least 6 characters" });
    }

    // التأكد من أن roles هي مصفوفة، إذا كانت سترينج نحولها لمصفوفة
    const formattedRoles = Array.isArray(roles) ? roles : [roles];

    // إنشاء مستخدم جديد
    const user = await userModel.create({
      username,
      firstName,
      lastName,
      email,
      password,
      roles: formattedRoles
    });

    res.status(201).json({ status: "success", data: user });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.login = async function (req, res) {
  let { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "you must provide email and password" });
  }

  let user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ status: "fail", message: "invalid email or password" });
  }

  let isValid = await bcryptjs.compare(password, user.password);
  if (!isValid) {
    return res
      .status(400)
      .json({ status: "fail", message: "invalid email or password" });
  }

  // Check if the user has 'admin' role
  if (!user.roles.includes("admin")) { // تغيير هنا
    return res
      .status(403)
      .json({ status: "fail", message: "You are not authorized as an admin" });
  }

  let token = jwt.sign(
    { id: user._id, email: user.email, roles: user.roles },
    process.env.Secret,
    { expiresIn: '1h' } 
  );
  console.log(user._id, user.email, user.roles);  // للتأكد من القيم

    res.status(200).json({ status: "success", data: { token } });
};
