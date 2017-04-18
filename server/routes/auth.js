var jwt = require('express-jwt');
var secret = require('../config').secret;

function getTokenFromHeaderOrQuerystring(req){
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token){
        return req.query.token;
    }
    return null;
}

var auth = {
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getTokenFromHeaderOrQuerystring
    }),
    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeaderOrQuerystring
    })
};

module.exports = auth;