const mongoose = require("mongoose");
require('dotenv').config()

async function dbConnect() {
  mongoose.connect(process.env['DB_URL'])
.then(() => {
  console.log('Database connection successful')
})
.catch(err => {
  console.log('Database connection error')
})
}

module.exports = dbConnect;
