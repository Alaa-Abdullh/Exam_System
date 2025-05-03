const jwt = require("jsonwebtoken");  
exports.auth = function (req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ status: "fail", message: "Unauthorized: Missing token" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "fail", message: "Unauthorized: Empty token" });
  }

  // try {
    const decoded = jwt.verify(token, process.env.Secret); 
    console.log('Decoded token:', decoded);  // اطبع محتوى التوكن
    req.id = decoded.id;
    req.roles = decoded.roles;
    console.log('User roles:', req.roles);  // اطبع الأدوار
    next();
  // } catch (err) {
  //   return res.status(401).json({ status: "fail", message: "Unauthorized: Invalid token" });
  // }

};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.roles || !req.roles.some(role => roles.includes(role))) {
      return res.status(403).json({ status: "fail", message: "forbidden" });
    }
    next();
  };
};
