const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const auth = require('./Routers/auth');
dotenv.config();
const dbConnect = require("./db/dbConnect");
const prodRouter = require('./Routers/Products');

dbConnect();

app.use(express.json());

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

app.use("/", auth);
app.use('/products', prodRouter);

/*
app.get("/Home", (request, response) => {
  response.json({ message: "free endpoint" });
});

app.get("/Dashboard", auth, (request, response) => {
  response.send({ message: "authentication endpoint" });
});
*/
module.exports = app;