const ErrorHandler = require('../helpers/ErrorHandler');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  getToken(req,res,next){

      const bearerHeader = req.headers['authorization'];

      if(typeof bearerHeader === 'undefined'){
          return res.sendStatus(403);
      }

      const bearer = bearerHeader.split(' ');

      req.token = bearer[1];

      return next();
  },

  async verifyToken(req,res,next){

      ErrorHandler.handleTryAndCatch(async () => {
          let decoded = await jwt.verify(req.token,config.authentication.jwtSecret);
          req.user = decoded;
          console.log(decoded);
          return next();
      },res);

  }
};