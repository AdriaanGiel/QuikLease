let express = require('express');
let router = express.Router();
// let passport = require('passport');
let AuthController = require('../controllers/AuthController');
let AuthMiddleware = require('../middleware/isLoggedIn');


/* GET home page. */
router.get('/logout',AuthController.logout);

router.post('/login', AuthController.login);

// Add isLoggedIn middleware
router.post('/cancel-verification',AuthController.cancelVerification);
router.post('/verification',AuthController.confirmVerification);
router.get('/verification',AuthMiddleware.isLoggedIn,AuthController.stepVerification);

module.exports = router;
