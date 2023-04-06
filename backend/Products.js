const express = require("express");
const router = express.Router();
const Products = require("./db/prodModel");

router.get("/", async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const product = new Products({
    name: req.body.name,
    price: req.body.price
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }

  if (req.body.price != null) {
    res.product.price = req.body.price;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getProduct, async (req, res) => {
  try {
    await Products.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted Product" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Products.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;