var express = require('express');
var router = express.Router();

// router.options('/', (re,res,next) => {
//     res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
//     res.header('Allow', 'GET,OPTIONS');
//     return res.status(200).json({});
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quicklease' });
});

module.exports = router;
