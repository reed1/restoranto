
var fs = require('fs'),
  path = require('path')
;

module.exports = function(app) {

  // treat all first level files in views directory as page (dynamic)
  fs.readdirSync(__dirname + '/views').forEach(function(file) {

    var ext = path.extname(file);
    var page = path.basename(file, ext);

    app.get('/' + page, function(req, res) {
      res.render(page);
    });

  });

};
