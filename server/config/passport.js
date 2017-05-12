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
                user.displayName = profile.displayName;
                user.gender = profile.gender;
                user.image = user.image ? user.image : profile.photos[0].value
                if (profile.provider === 'facebook') {
                    user.facebookImage = profile.photos[0].value;
                    user.facebookProfileUrl = profile.profileUrl;
                } else {
                    user.googleImage = profile.photos[0].value;
                    user.googleProfileUrl = profile._json.url;
                }
                user.save(function (err) {
                    if (err)
                        console.log(err);
                    return done(null, user);
                });
            } else {
                var newUser = new User();
                newUser.email = profile.emails[0].value;
                newUser.displayName = profile.displayName;
                newUser.username = profile.emails[0].value.split('@')[0];
                newUser.image = profile.photos[0].value;
                newUser.gender = profile.gender;
                if (profile.provider === 'facebook') {
                    newUser.facebookImage = profile.photos[0].value;
                    newUser.facebookProfileUrl = profile.profileUrl;
                } else {
                    newUser.googleImage = profile.photos[0].value;
                    newUser.googleProfileUrl = profile._json.url;
                }
                newUser.setPassword("virender");
                newUser.save(function (err) {
                    console.log("err", err);
                    return done(null, newUser);
                });
            }
        }).catch(err => console.log(err));

    });
}
passport.use(new GoogleStrategy(GoogleAuth, verifySocialAccount));
passport.use(new FacebookStrategy(FacebookAuth, verifySocialAccount));
