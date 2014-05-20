
var async = require('async'),
  mongoose = require('mongoose'),
  _ = require('lodash')
  ;

// bootstrap db
require('../db/index');

function main(cb) {

  var model = mongoose.model('warung');

  async.series([
    function(cb) {
      // drop existing data
      model.collection.drop(cb);
    },
    function(cb) {
      // reset autoincrement counter
      model.resetCount(cb);
    },
    function(cb) {
      // ensure text index
      model.collection.ensureIndex({
        name: 'text',
        owner: 'text'
      }, cb);
    },
    function(cb) {

      // generate random warungs
      var nameGen = NameGenerator(['jo', 'ko', 'wi', 'su', 'par', 'man', 'se', 'ku', 'teng'], 2, 3);
      var ownerGen = NameGenerator(['ma', 'kan', 'a', 'yam', 'go', 'reng'], 3, 2);

      async.eachSeries(_.range(300), function (i, cb) {
        new model({
          name: nameGen(),
          owner: ownerGen()
        }).save(cb);
      }, cb);
    }
  ], cb);

}


function NameGenerator(parts, maxWord, maxPart) {

  return function() {
    var words = [];
    _.range(_.random(1, maxWord)).forEach(function() {
      var picks = [];
      _.range(_.random(1, maxPart)).forEach(function() {
        var part = parts[_.random(0, parts.length - 1)];
        picks.push(part);
      });
      words.push(picks.join(''));
    });

    return words.join(' ');
  }
}

// if this is top module (file executed directly)
if (!module.parent) {
  main(function(err){
    if (err) {
      console.log(err);
    }

    console.log('script completed');
    mongoose.disconnect();
  });
}
