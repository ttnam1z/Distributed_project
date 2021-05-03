const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports.getRoomTime = async (sequelize, info)=>{
  const RoomTime = sequelize.models.RoomTime; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var room = await RoomTime.findOne({ where: { roomid:info.roomid, user:info.user} });
  
  if (room === null) {
    console.log('Not found!');
  } else {
    console.log("get room time")
    console.log(room); 
  }
  return room;
};

module.exports.getRoomTimes = async (sequelize, info)=>{
  const RoomTime = sequelize.models.RoomTime; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var rooms = await RoomTime.findAll({ where: { user:info.user} });
  
  if (rooms === null) {
    console.log('Not found!');
  } else {
    console.log("get room times")
    console.log(rooms); 
  }
  return rooms;
};


module.exports.createRoomTime = async (sequelize, info)=>{
  const RoomTime = sequelize.models.RoomTime; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var room = RoomTime.build({
    roomid:info.roomid, 
    user:info.user,
    leftTime:info.leftTime
  });
  await room.save();
  console.log("done save room" + room.userGlobal1 + " " +room.userGlobal2)

  // Check create ok:
  room = await RoomTime.findOne({where:{
    roomid:info.roomid, 
    user:info.user,
    leftTime:info.leftTime
  }})
  if (room === null) {
    console.log('save room fail');
  } else {
    console.log("save room successful"); // true
    console.log(room); 
  }
  return room;
};

