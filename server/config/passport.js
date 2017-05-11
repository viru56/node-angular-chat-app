var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var GoogleAuth = require('./').GoogleAuth;
var FacebookAuth = require('./').FacebookAuth;
// Serialize and Deserialize user instances to and from the session.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, (email, password, done) => {
    User.findOne({ $or: [{ email: email }, { username: email }] }).then(user => {
        if (!user || !user.validatePassword(password)) {
            return done(null, false, {
                errors: { 'email or password': 'is invalid' }
            });
        }
        return done(null, user);
    }).catch(done);
}));
var verifySocialAccount = function (accessToken, refreshToken, profile, done) {
    process.nextTick(() => {
        User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) {
                return done(err, null);
            }
            if (user) {
                user.socialId = profile.id;
                user.provider = profile.provider;
                user.name =  profile.displayName;
                user.image = profile.photos[0].value;
                user.gender = profile.gender;
                user.provider = profile.provider;
                user.profileUrl = profile._json.url || profile.profileUrl;
                user.save(function (err) {
                    if (err)
                        console.log(err);
                    return done(null, user);
                });
            } else {
                var newUser = new User();
                newUser.socialId = profile.id;
                newUser.email = profile.emails[0].value;
                newUser.name = profile.displayName;
                newUser.username = profile.emails[0].value.split('@')[0];
                newUser.image = profile.photos[0].value;
                newUser.gender = profile.gender;
                newUser.provider = profile.provider;
                newUser.profileUrl = profile.link || profile.profileUrl;
                newUser.setPassword("virender");
                newUser.save(function (err) {
                    if (err)
                        console.log(err);
                    return done(null, newUser);
                });
            }
        }).catch(err => console.log(err));

    });
}
passport.use(new GoogleStrategy(GoogleAuth, verifySocialAccount));
passport.use(new FacebookStrategy(FacebookAuth, verifySocialAccount));
