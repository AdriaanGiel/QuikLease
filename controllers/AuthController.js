const nexmo = require('../nexmo');
const jwt = require('jsonwebtoken');
const {User} = require('../ai_database');
const ErrorHandler = require('../helpers/ErrorHandler');
const config = require('../config');

class AuthController{
    // Controller methods
    async login(req,res) {

        let data = req.body;
        let user = await User.findOne({where:{email:data.email}});

        if(!user){
            return res.json({error:"error"})
        }

        if(user.comparePassword(data.password)){
            let token = await jwt.sign({first:true},config.authentication.jwtSecret);

            return res.json({token: token});
        }
        
        return res.sendStatus(400);
    }

    async stepVerification(req,res) {

        ErrorHandler.handleTryAndCatch(async () => {
            let result = AuthController.verify(31612630885);
            return res.json({result: result})
        },res);

    }

    async cancelVerification(req,res){

        let requestId = req.body.reqId;

        try {
            let result = AuthController.cancel(requestId);
            return res.json({result});
        }catch (e) {
            return res.json({error:e});
        }
    }

    async confirmVerification(req,res){
        
        let requestId = req.body.reqId;
        let code = req.body.code;

        try {
            let result = AuthController.check(requestId,code);
            return res.json({result});
        }catch (e) {
            return res.json({error: e});
        }
    }

    async logout(req,res){
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(ip);

        // try {
        //     let destroyed = await req.session.destroy();
        //     return res.redirect("/auth/login")
        // }catch (e) {
        //     return res.json(e);
        // }
    }

    // Static Nexpo methods
    static async verify(number) {
        return new Promise(function (resolve, reject) {
            nexmo.verify.request({
                number: number,
                brand: "QuickLease"
            }, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async check(reqId, code) {
        return new Promise(function(resolve, reject) {
            nexmo.verify.check({
                request_id: reqId,
                code: code
            }, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    static async cancel(reqId) {
        return new Promise(function(resolve, reject) {
            nexmo.verify.control({
                request_id: reqId,
                cmd: 'cancel'
            }, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
}

module.exports = new AuthController();