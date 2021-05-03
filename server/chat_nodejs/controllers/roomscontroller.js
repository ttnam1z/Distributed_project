const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports.getRoom = async (sequelize, info)=>{
  const chatRoom = sequelize.models.ChatRoom; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var room = await chatRoom.findOne({ where: { 
    userGlobal1:info.idlist[0], 
    userGlobal2:info.idlist[1]} });
  
  if (room === null) {
    console.log('Not found!');
  } else {
    console.log(room instanceof chatRoom); // true
    console.log(room); 
  }
  return room;
};

module.exports.createRoom = async (sequelize, info)=>{
  const chatRoom = sequelize.models.ChatRoom; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var room = chatRoom.build({ 
    userGlobal1:info.idlist[0], 
    userGlobal2:info.idlist[1]});
  await room.save();
  console.log("done save room" + room.userGlobal1 + " " +room.userGlobal2)

  // Check create ok:
  room = await chatRoom.findOne({where:{
    userGlobal1:info.idlist[0], 
    userGlobal2:info.idlist[1]
  }})
  if (room === null) {
    console.log('save room fail');
  } else {
    console.log("save room successful"); // true
    console.log(room); 
  }
  return room;
};

