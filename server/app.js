var fs = require('fs'),
  path = require('path'),
  http = require('http'),
  methods = require('methods'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  passport = require('passport'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose'),
  MONGODB_URI = require('./config').MONGODB_URI,
  SECRET = require('./config').secret;
var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
// app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

// if (!isProduction) {
//   app.use(errorhandler());
// }

if (isProduction) {
  mongoose.Promise = global.Promise;
  mongoose.connect(MONGODB_URI);
} else {
  mongoose.Promise = global.Promise;
  mongoose.connect(MONGODB_URI);
 // mongoose.set('debug', true);
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
  });
}
require('./models/User');
require('./models/Chat');
require('./models/Room');
require('./config/passport')
app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + server.address().port);
});

require('./services/socket.service')(app, server)
