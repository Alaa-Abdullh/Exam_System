const joi = require("joi");

exports.validation = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return res.status(500).json({ status: "fail", message: "Schema is not provided" });
    }

    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      return res.status(422).json({ status: 'fail', message: error.details });
    }
    next();
  };
};
