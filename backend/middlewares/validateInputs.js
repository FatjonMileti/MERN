const validator = require('validator');

module.exports = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: "Email and password are required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send({
      message: "Invalid email format",
    });
  }

  next();
};