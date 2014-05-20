var express = require('express'),

  config = require('./config/config');

require('express-namespace');
var app = express();

require('./lib/petakumpet/express')(app);
require('./lib/petakumpet/routing')(app);

app.listen(config.web.port, function(err) {

  if(err) {
    console.log(err);
  } else {
    console.log('App listening on port: ', config.web.port);
  }

});
