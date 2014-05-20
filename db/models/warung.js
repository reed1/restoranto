
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment')
;

var NAME = 'warung';

var WarungSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  owner: String
},{
  collection: NAME
});

WarungSchema.plugin(autoIncrement.plugin, NAME);

mongoose.model(NAME, WarungSchema);
