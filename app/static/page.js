
var fs = require('fs'),
  path = require('path')
;

module.exports = function(get) {

  // treat all first level files in views directory as page (dynamic)
  fs.readdirSync(__dirname + '/views').forEach(function(file) {

    if (!fs.statSync(__dirname + '/views/' + file).isFile()) {
      return;
    }

    var ext = path.extname(file);
    var page = path.basename(file, ext);

    get(page, function(req, res) {
      res.render(page);
    });

  });

};
