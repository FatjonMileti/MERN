const mongoose = require("mongoose");

const ProdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },

  price: {
    type: Number,
    required: true 
  },
});

module.exports = mongoose.model.Products || mongoose.model("Products", ProdSchema);