const {user} = require('../database');

class AuthenticationController {
    async login(req,res){


        return res.json({ login: "Data" });
    }
}

module.exports = new AuthenticationController();