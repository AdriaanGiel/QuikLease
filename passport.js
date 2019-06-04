let {User} = require("./ai_database");
let passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async function(username, password, done) {
        try {
            let user = await User.findOne({
                where: {
                    email: username,
                }
            });

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.comparePassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            delete user.password;
            return done(null,user);

        }catch (e) {
            return done(e,false,{ message: 'User does not exist in database' });
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});