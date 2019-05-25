const jwt = require('jsonwebtoken');
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

      try{
          let decoded = await jwt.verify(req.token,'secretStuff');

          req.user = decoded;
          return next();

      }catch (e) {
          return res.sendStatus(403);
      }
  }
};