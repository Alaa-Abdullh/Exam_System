const joi = require("joi");

let registerSchema = joi.object({
  username: joi.string().min(8).max(20).required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")),  
  password: joi.string().required(),
  roles: joi.string().valid("user", "admin").default("user"),
});

module.exports = registerSchema;
