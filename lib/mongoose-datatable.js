
var _ = require('lodash'),
  async = require('async'),
  mongoose = require('mongoose')

;

exports.createHandler = function(opts) {

  return function(req, res, next) {

    var q = resolveQuery(opts.baseQuery, req);
    var model = mongoose.model(opts.model);

    async.series([

      function(cb) {
        // count all
        model.count(cb);
      },
      function(cb) {
        // count filtered
        model.find(q).count(cb);
      },
      function(cb) {
        // get results
        model
          .find(q)
          .select(resolveSelect(opts.columns))
          .sort(resolveSort(opts.columns, req))
          .skip(parseInt(req.query.start))
          .limit(parseInt(req.query.length))
          .lean()
          .exec(cb);
      }
    ], function(err, results) {

      if (err) {
        return res.status(500).send(err);
      }

      var recordsTotal = results[0];
      var recordsFiltered = results[1];
      var items = results[2];

      res.send({
        recordsTotal: recordsTotal,
        recordsFiltered: recordsFiltered,
        data: flatten(items, opts.columns)
      });

    });
  };
};

function flatten(items, columns) {
  var rows = [];

  _.each(items, function(item) {
    var row = [];
    _.each(columns, function(col){
      row.push(item[col]);
    });
    rows.push(row);
  });

  return rows;
}

function resolveSort(columns, req) {
  var sort = {};

  var col = columns[req.query.order[0].column];
  sort[col] = req.query.order[0].dir;
  return sort;
}

function resolveSelect(columns) {
  return columns.join(' ');
}

function resolveQuery(base, req) {
  var q = _.cloneDeep(base || {});

  var search = req.query.search.value;
  if (search) {
    q.$text = { $search: search };
  }

  return q;
}
