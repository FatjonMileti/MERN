const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const getProduct = require("../middlewares/getProduct");
const { authMiddleware } = require("../middlewares/authMiddleware");


router.route("/", authMiddleware)
  .get(productController.getProductList)
  .post(productController.createProduct);

router.route("/:id")
  .put(getProduct, productController.updateProduct)
  .delete(getProduct, productController.deleteProduct);

module.exports = router;