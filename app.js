const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const lights = require('./routes/lights');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/lights', lights);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(req.app.get('env') === 'development' ? {name: err.name, message: err.message} : {});
});

module.exports = app;
