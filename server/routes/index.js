var router = require('express').Router();
var passport = require('passport');

router.use('/api', require('./api'));
module.exports = router;
