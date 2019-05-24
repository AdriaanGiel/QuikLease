var express = require('express');
var router = express.Router();
const SchoolController = require("../controllers/SchoolController");

/* GET users listing. */
router.get('/', SchoolController.index);
router.get('/:id', SchoolController.single);

module.exports = router;