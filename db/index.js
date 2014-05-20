
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  fs = require('fs'),
  path = require('path'),

  config = require('../config/config')
;

// connect to db
var db = mongoose.connect(config.db.url);
autoIncrement.initialize(db);

// bootstrap all models
fs.readdirSync(__dirname + '/models').forEach(function(file) {
  require('./models/' + file);
});

// expose db variable
module.exports = db;
