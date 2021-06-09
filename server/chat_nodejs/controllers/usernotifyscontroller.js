const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports.getUserNotify = async (sequelize, info)=>{
  const UserNotify = sequelize.models.UserNotify; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var noti = await UserNotify.findOne({ where: { 
    info:info.info, 
    user:info.user, 
    type:info.type} });
  
  if (noti === null) {
    console.log('Not found!');
  } else {
    console.log("get noti time")
    console.log(noti); 
  }
  return noti;
};

module.exports.getUserNotifys = async (sequelize, info)=>{
  const UserNotify = sequelize.models.UserNotify; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var notis = await UserNotify.findAll({ where: { 
    user:info.user,
    type:info.type
  } });
  
  if (notis === null) {
    console.log('Not found!');
  } else {
    console.log("get noti times")
    console.log(notis); 
  }
  return notis;
};


module.exports.getAllNotifys = async (sequelize)=>{
  const UserNotify = sequelize.models.UserNotify; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var notis = await UserNotify.findAll();
  return notis;
};


module.exports.createUserNotify = async (sequelize, info)=>{
  const UserNotify = sequelize.models.UserNotify; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var noti = UserNotify.build({
    info:info.info, 
    user:info.user, 
    type:info.type
  });
  await noti.save();
  console.log("done save noti" + noti.user + " " +noti.info)

  // Check create ok:
  noti = await UserNotify.findOne({where:{
    info:info.info, 
    user:info.user, 
    type:info.type
  }})
  if (noti === null) {
    console.log('save noti fail');
  } else {
    console.log("save noti successful"); // true
    console.log(noti); 
  }
  return noti;
};

module.exports.deleteUserNotify = async (sequelize,info)=>{
  const UserNotify = sequelize.models.UserNotify; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var noti = await UserNotify.destroy({ where: { 
    info:info.info, 
    user:info.user, 
    type:info.type} });
  
  if (noti === null) {
    console.log('delete noti 1');
  } else {
    console.log("delete noti 2")
    console.log(noti);
  }
  return noti;
}

