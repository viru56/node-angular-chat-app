var mongoose = require('mongoose'),
    router = require('express').Router(),
    passport = require('passport'),
    request = require('request'),
    path = require('path'),
    fs = require('fs'),
    User = mongoose.model('User'),
    auth = require('../auth'),
    fs = require('fs'),
    Jimp = require("jimp");

router.get('/user', auth.required, (req, res, next) => {
    User.findById(req.payload.id).then(user => {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json({
            user: user.toAuthJSON()
        });
    }).catch(next)
});
router.get('/users', auth.required, (req, res, next) => {
    var projection = { 'email': 1, 'username': 1, 'image': 1, 'latitude': 1, 'longitude': 1, 'phone': 1, 'logedIn': 1 };
    User.find({ _id: { $ne: req.payload.id } }, projection).exec((err, users) => {
        if (err) {
            return res.sendStatus(401);
        }
        return res.json({ users });
    }).catch(next)
});

router.post('/user', (req, res, next) => {
    if (!req.body.user) {
        return res.status(422).json({
            errors: {
                user: "Object can't be blank",
                info: "pass username, email and password in user object"
            }
        })
    }
    //email and username is required so we do not need to handle error mongoose will throw error
    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }
    var user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.displayName = req.body.user.displayName;
    user.setPassword(req.body.user.password.toString());
    user.save().then(() => {
        return res.json({ user: user.toAuthJSON() });
    }).catch(next);
});

router.put('/user', auth.required, (req, res, next) => {
    console.log(req.payload.id);
    User.findById(req.payload.id).then(user => {
        if (!user) {
            return res.sendStatus(401);
        }
        if (typeof req.body.user.displayName !== "undefined") {
            user.displayName = req.body.user.displayName;
        }
        if (typeof req.body.user.username !== "undefined") {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== "undefined") {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.password !== "undefined") {
            user.setPassword(req.body.user.password);
        }
        if (typeof req.body.user.image !== "undefined") {
            user.image = req.body.user.image;
        }
        if (typeof req.body.user.phone !== "undefined" && req.body.user.phone !== "") {
            user.phone = req.body.user.phone;
        }
        if (typeof req.body.user.latitude !== "undefined") {
            user.latitude = req.body.user.latitude;
        }
        if (typeof req.body.user.longitude !== "undefined") {
            user.longitude = req.body.user.longitude;
        }
        return user.save().then(() => {
            //save user image in small size for showing on map 
            if (user.image) {
                saveImage(user.image, user.username);
            }
            return res.json({ user: user.toAuthJSON() });
        });
    }).catch(next);
});
router.post('/user/login', (req, res, next) => {
    if (!req.body.user) {
        return res.status(422).json({
            errors: {
                user: "Object can't be blank",
                info: "pass email and password in user object"
            }
        })
    }
    if (!req.body.user.email) {
        return res.status(422).json({ errors: { 'email or username': "can't be blank" } });
    }
    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            return res.json({
                user: user.toAuthJSON()
            });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});
// GET /auth/google

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
// GET /auth/google/callback
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        saveImage(req.user.image, req.user.username, () => {
            return res.json(req.user.toAuthJSON());
        });
    }
);
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        saveImage(req.user.image, req.user.username, () => {
            return res.json(req.user.toAuthJSON());
        });
    }
);

const saveImage = function (imgUrl, username, cb) {
    //var filePath = `.\\public\\images\\${username}.jpg`;
    var filePath = path.join(__dirname, '../../', 'public', 'images', `${username}.jpg`);
    if (!fs.existsSync(filePath)) {
        Jimp.read(imgUrl).then((image) => {
            image.resize(30, 30)
                .quality(60)
                .autocrop()
                .write(filePath);
            if (cb) cb();
        }).catch((err) => { if (cb) { cb(); } });
    } else {
        if (cb) { cb() };
    }
};

module.exports = router;