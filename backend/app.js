const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require('validator')

const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const auth = require("./auth");
const prodRouter = require('./Products');

dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/products', prodRouter);

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// register endpoint
app.post("/register", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).send({
      message: "Email and password are required",
    });
    console.log(response);
  }

  if (!validator.isEmail(email)) {
    return response.status(400).send({
      message: "Invalid email format",
    });
  }

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return response.status(400).send({
        message: "User alredy exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      password: hashedPassword,
    });

    await user.save();

    response.status(201).send({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error creating user",
      error,
    });
  }
})

app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).send({
      message: "Email and password are required",
    });
  }

  if (!validator.isEmail(email)) {
    return response.status(400).send({
      message: "Invalid email format",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).send({
        message: "Email not found",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return response.status(400).send({
        message: "Passwords does not match",
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

    response.status(200).send({
      message: "Login Successful",
      email: user.email,
      token,
      refreshToken,
    });
  } catch(error) {
    response.status(500).send({
      message: "Error logging in",
      error,
    });
  }
});

app.get("/Home", (request, response) => {
  response.json({ message: "free endpoint" });
});

app.get("/Dashboard", auth, (request, response) => {
  response.send({ message: "authentication endpoint" });
});

module.exports = app;