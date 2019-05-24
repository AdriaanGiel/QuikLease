var express = require('express');
var router = express.Router();
const BikeController = require("../controllers/BikeController");

/* GET users listing. */
router.get('/', BikeController.index);
router.get('/:id', BikeController.single);

module.exports = router;