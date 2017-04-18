var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, (email, password, done) => {
    User.findOne({$or: [{ email: email },{username : email}]}).then(user => {
        if (!user || !user.validatePassword(password)) {
            return done(null, false, {
                errors: { 'email or password': 'is invalid' }
            });
        }
        return done(null, user);
    }).catch(done);
}));
