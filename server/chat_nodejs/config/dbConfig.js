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

// sequelize.authenticate().then(() => {
//   console.log('Connection established successfully.');
// }).catch(err => {
//   console.error('Unable to connect to the database:', err);
// }).finally(() => {
//   // sequelize.close();
//   // console.log("Quit")
// });

// Init all models
let ServerData = require('../models/serverModel')(sequelize);
let UserLocal = require('../models/userLocalModel')(sequelize);
let UserGlobal = require('../models/userGlobalModel')(sequelize);
let BlockList = require('../models/blockModel')(sequelize);
let ChatRoom = require('../models/roomModel')(sequelize);
let MessageList = require('../models/msgModel')(sequelize);

/*
ServerData.sync({force:true}).then(()=>{
  UserLocal.sync({force:true}).then(()=>{
    UserGlobal.sync({force:true}).then(()=>{
      BlockList.sync({force:true}).then(()=>{
        ChatRoom.sync({force:true}).then(()=>{
          MessageList.sync({force:true}).then(()=>{});
        });
      });
    });
  });
}).catch(err=>{

});*/
module.exports = sequelize


