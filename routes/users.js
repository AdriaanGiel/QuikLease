var express = require('express');
var router = express.Router();
const DummyController = require("../controllers/DummyController");

/* GET users listing. */
router.get('/', DummyController.index);

module.exports = router;
