const Nexmo = require('../nexmo');

class AuthController{
    // Controller methods
    async login(req,res) {

        
        return res.json(req.session)
    }

    async stepVerification(req,res) {
        try {
            let result = AuthController.verify(31612630885);
            return res.json({result: result})
        }catch (e) {
            return res.json({error: e});
        }
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
        try {
            let destroyed = await req.session.destroy();
            return res.redirect("/auth/login")
        }catch (e) {
            return res.json(e);
        }
    }

    // Static Nexpo methods
    static async verify(number) {
        return new Promise(function (resolve, reject) {
            Nexmo.verify.request({
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
            Nexmo.verify.check({
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