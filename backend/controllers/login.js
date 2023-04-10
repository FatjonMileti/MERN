const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../db/userModel");

module.exports = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        message: "Email not found",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).send({
        message: "Passwords do not match",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      process.env['ACCESS_TOKEN_SECRET'],
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      process.env['REFRESH_TOKEN_SECRET'],
      { expiresIn: "7d" }
    );

    res.status(200).send({
      message: "Login Successful",
      email: user.email,
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error logging in",
      error,
    });
  }
};