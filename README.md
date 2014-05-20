
# resoranto

restoranco app on top of petakumpet flavored express

***

### How to run

Ensure you have installed nodejs (node & npm commands are in path)

    git clone https://github.com/reed1/restoranto.git
    cd restoranto
    npm install                        #install server side libraries
    ./node_modules/.bin/bower install  #install client side libraries
    node index.js                      #start the server
    
be sure to restart the server (abort and re-run the last command) after code changes 
or use [nodemon](nodemon.io) like for automated restart

***

### Routing

Routing schema is defined like this : /appName/controllerName/actionName

* action is managed in controller js file, also the methods, example:
        
        app.get('/login', function(req, res) {
          res.render('admin/login');
        });
        
        app.post('/login', function(req, res) {
          // code..
        });
        
* all apps should be registered in "config/routing.json"
      
* rather than prefix based, this one is appName enforced
 
Convention over magic. However, **redirects** is supported for convenience

* root level redirect

        "redirects": {
          "/": "/frontend",
          "/all-about-us": "/static/page/about",
          "/all/about/you": "/static/page/about"
        },
        
* app level redirect

        {
          "name": "backend",
          "redirects": {
            "/": "/admin/login"
          },
          "errorTemplates": {
            "404": "error/404"
          }
        },

### Web Resources

All apps will have it's own web resources folder (web).
Root level web resource is provided for shared resources.

* root level web resource path is 
        
        /web

* app level web resource path is 

        /appName/web

### Static pages

Will have it's own space in "static" app, it's not supported on framework level.

### Templating

Uses [Jade](www.jade-lang.com)

layout is not enforced, can be multi level, etc.
Also with jade you get layout, variables, includes, blocks, ...

### Auth

"RBAC persisted in db" is not yet supported, 
however for some cases like dynamic access check later e.g. franchisor can only see its own child franchisee(s),
it should be on it's own business logic layer, for now the auth is implemented like in 

    /app/backend/admin.js

### Db

Not supported yet, but likely Bookshelf (if relational) and mongoose (if nosql)

### Server-Side Widgets

Not supported yet. Separation of concerns is always recommended, 
but this one is for widget that has tight binding (and opinionated) server-client, 
and re-used multiple times.

### Server side libraries

like express, jade, etc are managed through npm, example:
  
    npm install --save jade
    
_--save_ means the package name will automatically be saved in package.json file

### Client side libraries

like jquery, bootstrap, etc are managed through bower, example:
  
    ./node_modules/.bin/bower install --save jquery

_--save_ means the package name will automatically be saved in bower.json file
    
***

That's all and kiss..