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
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
  
}, { timestamps: true }); 


userSchema.pre('save', async function(next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    // Generate a salt
    const salt = await bcryptjs.genSalt(10);
    // Hash the password along with our new salt
    const hashedPassword = await bcryptjs.hash(this.password, salt);
    // Override the cleartext password with the hashed one
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
