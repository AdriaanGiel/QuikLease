class AuthMiddleware{
    static isLoggedIn(req,res,next){
        if(req.user){
            return next();
        }
        return res.redirect("/auth/login");
    }

    static isLoggedInAndVerified(req,res,next){
        if(req.user || req.user.verified == 1){
            return next();
        }
        return res.redirect("/auth/login");
    }
}

module.exports = AuthMiddleware;
