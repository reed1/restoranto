
var mongooseDatatable = require('../../lib/mongoose-datatable')
  ;

module.exports = function(app) {

  app.get('/warung', function(req, res) {
    res.render('datatable/warung');
  });

  app.get('/warung-data', mongooseDatatable.createHandler({
    model: 'warung',
    columns: [ '_id', 'name', 'owner' ],
    baseQuery: {}
  }));

};
