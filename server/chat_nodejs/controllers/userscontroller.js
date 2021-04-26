var { Sequelize, Model, DataTypes } = require('sequelize');

module.exports.test = async (sequelize)=>{
  // var User = require('../models/userModel')(sequelize);
  // the defined model is the class itself
  const User = sequelize.models.UserLocal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  
  var user = User.build({ name: 'name', hashpass: 'pass' });
  await user.save();
  console.log("done save");
};

module.exports.createUser = async (sequelize,user)=>{
  const User = sequelize.models.UserLocal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  
  var user = User.build({ name: user.name, hashpass: user.hashpass});
  await user.save();
  console.log("done save user" + user.name);

  // Check create ok:
  var user = await User.findOne({ where: { name: user.name } });
  if (user === null){
    console.log("save fail")
  } else{
    console.log("save successfully")
  }
  return user;
};

module.exports.getUsers = async (sequelize)=>{
  const User = sequelize.models.UserLocal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  
  const users = await User.findAll();
  if(users == undefined){
    console.log("fuck  ")
  }
  console.log(users.every(user => user instanceof User)); // true
  console.log("All users:", JSON.stringify(users, null, 2));
  return users;
};

module.exports.getUser = async (sequelize, name, hashpass)=>{
  const User = sequelize.models.UserLocal; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  if(hashpass == undefined){
    var user = await User.findOne({ where: { name:name } });
  } else{
    var user = await User.findOne({ where: { name:name ,hashpass:hashpass} });
  }
  
  if (user === null) {
    console.log('Not found!');
  } else {
    console.log(user instanceof User); // true
    console.log(user.name); 
  }
  return user;
};

