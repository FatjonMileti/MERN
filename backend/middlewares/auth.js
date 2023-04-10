const express = require("express");
const router = express.Router();
const { authMiddleware } = require("./authMiddleware");
const { getProtectedData } = require("../controllers/dataController");

router.get("/protected-data", authMiddleware, getProtectedData);

module.exports = router;