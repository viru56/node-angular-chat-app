var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

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
