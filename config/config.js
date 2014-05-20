
module.exports = {

  root: require('path').normalize(__dirname + '/..'),
  web: {
    port: 3000
  },
  db: {
    url: 'mongodb://localhost/restoranto'
  }

};
