
var fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  express = require('express'),

  config = require('../../config/config'),
  routeTable = require('../../config/routing')
  ;

module.exports = function(app) {

  var resourcePrefix = routeTable.resourcePrefix;

  // fix routing for appname only with trailing slash
  app.use(function(req, res, next) {
    var paths = req.path.split('/').slice(1);
    if (paths.length === 2 && paths[1] === '') {
      res.redirect('/' + paths[0]);
    } else {
      next();
    }
  });

  // loop for each apps defined in routeTable
  _.each(routeTable.apps, function(appConfig) {

    var appRoot = config.root + '/app/' + appConfig.name;

    // set views path and app variable
    app.use('/' + appConfig.name, function(req, res, next) {
      app.set('views', appRoot + '/views');
      res.locals.app = appConfig.name;
      next();
    });

    app.namespace('/' + appConfig.name, function() {

      // load each controllers
      fs.readdirSync(appRoot).forEach(function(file) {
        if (path.extname(file) === '.js') {
          var controllerName = path.basename(file, '.js');
          app.namespace('/' + controllerName, function() {
            require(appRoot + '/' + controllerName)(app);
          });
        }
      });

      // handle redirects
      _.each(appConfig.redirects, function(dst, src) {
        app.get(src, function(req, res) {
          res.redirect(appConfig.name + dst);
        });
      });

    });

    // handle static resources
    app.use('/' + appConfig.name + resourcePrefix,
      express.static(appRoot + resourcePrefix));
  });

  // handle root static resources
  app.use(resourcePrefix, express.static(config.root + resourcePrefix));

  // handle root redirects
  _.each(routeTable.redirects, function(dst, src){
    app.get(src, function(req, res){
      res.redirect(dst);
    });
  });

  // catch everything else as 404
  app.use(function(req, res, next) {

    var appConfig = resolveAppConfig(req.path);

    if (appConfig && appConfig.errorTemplates) {
      var view = appConfig.errorTemplates['404'];
      if (view) {
        var appRoot = config.root + '/app/' + appConfig.name;
        return res.status(404).render(appRoot + '/views/' + view);
      }
    }

    next();
  });
};

function resolveAppConfig(path) {

  var appName = path.split('/')[1];

  for (var i in routeTable.apps) {
    var appConfig = routeTable.apps[i];
    if (appConfig.name === appName) {
      return appConfig;
    }
  }
  return null;
}
