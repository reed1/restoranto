
var mongoose = require('mongoose'),

  mongooseDatatable = require('../../lib/mongoose-datatable')
  ;

module.exports = function(app) {

  app.get('/warung', function(req, res) {
    mongoose.model('warung').find().lean().exec(function(err, warungs) {

      res.render('datatable/warung', { warungs: warungs });

    });
  });

  app.get('/warung-data', mongooseDatatable.createHandler({
    model: 'warung',
    columns: [ '_id', 'name', 'owner' ],
    baseQuery: {}
  }));

};
