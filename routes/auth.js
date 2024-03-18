const express = require("express");
const router = express.Router();
const User = require("../controllers/UserController.js");
const Auth = require("../controllers/AuthController.js");
const userController = new User();
const authController = new Auth();

router.post('/register', userController.createUser);
router.post('/login', authController.login);

module.exports = router;