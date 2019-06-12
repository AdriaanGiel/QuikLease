var express = require('express');
var router = express.Router();
const AuthController = require("../controllers/AuthenticationController");

/* GET login routes */
router.get('/', AuthController.login);

module.exports = router;
