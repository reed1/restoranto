var connect = require('connect')
  ;

module.exports = function(app) {

  // jade templating engine
  app.set('view engine', 'jade');
  app.set('view cache', false);
  app.locals.pretty = true;

  app.use(connect.compress());
  app.use(connect.logger('dev'));
  app.use(connect.urlencoded());
  app.use(connect.cookieParser());
  app.use(connect.session({
    secret: 'tempsecret',
    store: new connect.session.MemoryStore()
  }));
  app.use(require('connect-flash')());

};
