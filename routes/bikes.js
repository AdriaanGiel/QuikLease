const express = require('express');
const router = express.Router();
const BikeController = require("../controllers/BikeController");

router.options('/', (re,res,next) => {
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.header('Allow', 'POST,GET,OPTIONS');
    return res.status(200).json({});
});

router.options('/:id', function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'PUT,DELETE,GET,OPTIONS');
    res.header('Allow', 'PUT,DELETE,GET,OPTIONS');
    return res.status(200).json({});
});

/* GET users listing. */
router.get('/', BikeController.index);
router.get('/:id', BikeController.single);

module.exports = router;