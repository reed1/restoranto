
var fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  express = require('express'),

  routeTable = require('../../config/routing')
  ;

var rootDir = require('../../config/config').root;
var resourcePrefix = routeTable.resourcePrefix;

module.exports = function(app) {

  var appName = null;
  var controller = null;

  function route(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (args.length < 2) {
        throw new Error('invalid route usage, pass first parameter as path and handler(s) after that(minimum 1)');
      }
      var action = args[0];
      var path = '/' + appName + '/' + controller + '/' + action;
      app[method].apply(app, [path].concat(args.slice(1)));
    };
  }

  var get = route('get');
  var post = route('post');

  // loop for each apps defined in routeTable
  _.each(routeTable.apps, function(appConfig) {

    appName = appConfig.name;
    var appDir = rootDir + '/app/' + appConfig.name;


    injectAppMiddleware(app, appConfig);

    // load each controllers
    fs.readdirSync(appDir).forEach(function(file) {
      if (path.extname(file) !== '.js') {
        return;
      }

      controller = path.basename(file, '.js');
      require(appDir + '/' + controller)(get, post);
    });

    // handle redirects
    handleAppRedirect(app, appConfig);

    // handle static resources
    app.use('/' + appName + resourcePrefix, express.static(appDir + resourcePrefix));
  });

  // handle root static resources
  app.use(resourcePrefix, express.static(rootDir + resourcePrefix));

  // handle root redirects
  _.each(routeTable.redirects, function(dst, src){
    app.get(src, function(req, res){
      res.redirect(dst);
    });
  });

  // catch everything else as 404
  app.use(function(req, res, next) {

    var appConfig = appByName(res.locals.app);
    if (appConfig && appConfig.errorTemplates) {
      var view = appConfig.errorTemplates['404'];
      if (view) {
        var appRoot = rootDir + '/app/' + appConfig.name;
        return res.status(404).render(appRoot + '/views/' + view);
      }
    }
    next();

  });
};

function appByName(name) {

  for (var i in routeTable.apps) {
    var appConfig = routeTable.apps[i];
    if (appConfig.name === name) {
      return appConfig;
    }
  }

  return null;
}

function injectAppMiddleware(app, appConfig) {

  var appName = appConfig.name;
  var appDir = rootDir + '/app/' + appName;

  // set views path and views variable
  app.use('/' + appName, function(req, res, next) {

    if (req.path.indexOf(resourcePrefix) === 0) {
      return next();
    }

    app.set('views', appDir + '/views');
    var paths = req.path.split('/').slice(1);

    if (paths.length >= 2) {
      res.locals.app = appName;
      res.locals.controller = paths[0];
      res.locals.action = paths[1];
    }

    next();
  });
}

function handleAppRedirect(app, appConfig) {

  var appName = appConfig.name;
  _.each(appConfig.redirects, function(dst, src) {

    if (src === '/') {
      src = '';
    }

    var handler = function(req, res) {
      res.redirect('/' + appName + dst);
    };

    app.get('/' + appName + src, handler);
    app.get('/' + appName + src + '/', handler);

  });
}
