const { Sequelize, Model, DataTypes } = require('sequelize');

var databaseconfig = {
  "dev":{
    "username":"nam",
    "password":"nam_pass",
    "database":"distributed_project",
    "host":"192.168.99.100",
    "port":3306,
    "dialect":"mysql",
    "operatorsAliases":false
  },
  "test":{
    "username":"nam",
    "password":"nam_pass",
    "database":"database_test",
    "host":"192.168.99.100",
    "port":3306,
    "dialect":"mysql",
    "operatorsAliases":false
  },
  "production":{
    "username":"nam",
    "password":"nam_pass",
    "database":"database_production",
    "host":"192.168.99.100",
    "port":3306,
    "dialect":"mysql",
    "operatorsAliases":false
  }
}
var state = "dev"
var database = databaseconfig[state]

const sequelize = new Sequelize(database.database, database.username, database.password, {
  host: database.host,
  port: database.port,
  dialect: database.dialect
});

// For all string can use
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

// sequelize.authenticate().then(() => {
//   console.log('Connection established successfully.');
// }).catch(err => {
//   console.error('Unable to connect to the database:', err);
// }).finally(() => {
//   // sequelize.close();
//   // console.log("Quit")
// });

// Init all models
let User = require('../models/userModel')(sequelize);

module.exports = sequelize


