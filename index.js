const express = require('express');
const bodyParser = require('body-parser');
const expressSanitzer = require('express-sanitizer');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./middlewares/logger.middleware');

let app = express();

// load config
let config;
if (process.env.NODE_ENV === 'DEVELOPMENT') config = require('./config');
else config = require('./config.test');

// set environment settings
let database = config.database;
let port = 3000;

// set up mongodb
mongoose.promise = global.Promise;
mongoose.connect(database, (err) => {
  if (err) {
    console.log('[Error] Cannot connect to Database.');
    process.exit(1);
  }
});

// for debug
if (config.logging) mongoose.set('debug', true);

// helmet protection
app.use(helmet());

// Cross-Origin Resource sharing
app.use(cors());

// jsonify requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Logging
if (config.logging) app.use(logger);

// escape params and user input
app.use(expressSanitzer());

// get routes from routes.js
let router = require('./routes');

// prefix all routes with /api
app.use('/api', router);

app.listen(port, () => {
  console.log(' -----------------------------------');
  console.log(' | WG API is running on port ' + port + '  |');
  console.log(' -----------------------------------');
});
module.exports = app;
