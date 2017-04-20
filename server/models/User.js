var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var secret = require('../config').secret;

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, "in invalid"],
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    image: String,
    hash: String,
    salt: String,
    phone: {
        type: String,
        minlength: [10, 'is too short'],
        maxlength: [13, 'is too long'],
        match: [/^\+?([0-9]){10,13}$/, 'is invalid']
    },
    latitude: Number,
    longitude: Number
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: "is already taken." })

// use this method to encript the user password
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};

// use this method to validate user password
UserSchema.methods.validatePassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

//use this method to genrate jwt token
UserSchema.methods.generateJwt = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 30) //set exipry date for 1 month
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
};

// use this method to return response
UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        image: this.image || "",
        phone: this.phone || "",
        latitude: this.latitude || 0,
        longitude: this.longitude || 0,
        token: this.generateJwt()
    };
};

mongoose.model('User', UserSchema);