const mongoose = require("mongoose");

const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true
  },


  roles: {
    type: [String],
    enum: ["user", "admin"],
    default: ["user"]
  }
  
}, { timestamps: true }); 
userSchema.pre('save',async function(next){
  let salt =await bcryptjs.genSalt(10);
  let hashedPassword =await bcryptjs.hash(this.password,salt);
  this.password=hashedPassword;
  next();
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
