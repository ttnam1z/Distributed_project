var { Sequelize, Model, DataTypes } = require('sequelize');

module.exports.createUser = async (sequelize,info)=>{
  const User = sequelize.models.UserGlobal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  
  var user = User.build({ name: info.name, serverId: info.serverId, userId:info.userId, hashpass:info.hashpass});
  await user.save();
  console.log("done save user" + user.name);

  // Check create ok:
  var user = await User.findOne({ where: { name: info.name } });
  if (user === null){
    console.log("save user global fail")
  } else{
    console.log("save  user global successfully")
    console.log(user)
  }
  return user;
};

module.exports.getUser = async (sequelize,name,serverId,globalId)=>{
  const User = sequelize.models.UserGlobal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  if(globalId == undefined){
    var user = await User.findOne({ where: { name:name, serverId:serverId} });
  } else{
    var user = await User.findOne({ where: { globalId:globalId} });
  }
  
  if (user === null) {
    console.log('Not found global user');
  } else {
    console.log("get global user"); // true
    console.log(user); 
  }
  return user;
};

module.exports.getUser_hass = async (sequelize, name, hashpass)=>{
  const User = sequelize.models.UserGlobal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  if(hashpass == undefined){
    var user = await User.findOne({ where: { name:name } });
  } else{
    var user = await User.findOne({ where: { name:name ,hashpass:hashpass} });
  }
  
  if (user === null) {
    console.log('Not found global user');
  } else {
    console.log(user instanceof User); // true
    console.log(user); 
  }
  return user;
};

module.exports.getUsers = async (sequelize)=>{
  const User = sequelize.models.UserGlobal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var users = await User.findAll();
  return users;
};