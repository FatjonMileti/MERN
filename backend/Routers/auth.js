const express = require('express');
const validateInputs = require('../middlewares/validateInputs');
const registerController = require('../controllers/register');
const loginController = require('../controllers/login');

const router = express.Router();

router.post('/register', validateInputs, registerController);
router.post('/login', validateInputs, loginController);

module.exports = router;