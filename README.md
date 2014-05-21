
# restoranto

restoranco app on top of petakumpet flavored express

***

### How to run

Ensure you have nodejs and mongodb installed

    git clone https://github.com/reed1/restoranto.git
    cd restoranto
    npm install                          # install server side libraries
    ./node_modules/.bin/bower install    # install client side libraries
    node scripts/init-db.js              # reset & initialize db data
    node index.js                        # start the server
    
be sure to restart the server (abort and re-run the last command) after code changes 
or use [nodemon](http://nodemon.io) like for automated restart

***

### Routing

Routing schema is defined like this : /appName/controllerName/actionName

* action is managed in controller js file, also the methods, example:
        
        get('/login', function(req, res) {
          res.render('admin/login');
        });
        
        post('/login', function(req, res) {
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

        /<appName>/web

### Static pages

Will have it's own space in "static" app, it's not supported on framework level.

### Templating

Uses [Jade](http://www.jade-lang.com)

layout is not enforced, can be multi level, etc.
Also with jade you get layout, variables, includes, blocks, ...

### Auth

"RBAC persisted in db" is not yet supported, 
however for some cases like dynamic access check later e.g. franchisor can only see its own child franchisee(s),
it should be on it's own business logic layer, for now the auth is implemented like in 

    /app/backend/admin.js

### Db

Uses [mongodb](http://www.mongodb.org) as database and [mongoose](http://mongoosejs.com) as ODM.
Schema located at

    /db/models/*

### Server side libraries

like express, jade, etc are managed through npm, example:
  
    npm install --save jade
    
_--save_ means the package name will automatically be saved in package.json file

### Client side libraries

like jquery, bootstrap, etc are managed through bower, example:
  
    ./node_modules/.bin/bower install --save jquery

_--save_ means the package name will automatically be saved in bower.json file
    
***

## Extras

### Datatable

Generic server side datatable handler for a mongodb model

* Create a Schema then populate some data

        var WarungSchema = new mongoose.Schema({
          _id: Number,
          name: String,
          owner: String
        }, { collection: 'warung' })
        
* Put this in the view

        table#table-warung.display
          thead
            tr
              th Id
              th Name
              th Owner
        script(type='text/javascript').
          $('#table-warung').dataTable({
            processing: true,
            serverSide: true,
            ajax: './warung-data'
          });

* Import the handler factory, located in 

        /lib/mongoose-datatable
     
* Handle the "./warung-data" ajax path

        get('/warung-data', mongooseDatatable.createHandler({
          model: 'warung',
          columns: [ '_id', 'name', 'owner' ],
          baseQuery: {}
        }));
        
That will handle request from datatable (sorting, limit, offset, etc) and returns the appropriate data
recognized by datatable. Text search is supported too (given text index is available on the model)

***

That's all and kiss..
