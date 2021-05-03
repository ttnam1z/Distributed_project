const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports.getMessages = async function (sequelize,info){
  const messageList = sequelize.models.MessageList; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var msg = await messageList.findAll({ where: { 
    roomId:info.roomId} ,
    order: [['timeStamp', 'DESC']]
    ,offset: 0, 
    limit: 200 
  });
  
  if (msg === null) {
    console.log('Not found! message');
  } else {
    console.log("get message")
    console.log(msg); 
  }
  return msg;

}

module.exports.createMessage = async (sequelize, info)=>{
  const messageList = sequelize.models.MessageList; 
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  var msg = messageList.build({
    roomId:info.roomId, 
    userGlobal:info.userGlobal,
    content:info.content,
    timeStamp:info.timeStamp});
  await msg.save();
  console.log("done save msg" + msg.roomId + " " +msg.content)

  // Check create ok:
  msg = await messageList.findOne({where:{
    roomId:info.roomId, 
    userGlobal:info.userGlobal,
    content:info.content,
    timeStamp:info.timeStamp
  }})
  if (msg === null) {
    console.log('save msg fail');
  } else {
    console.log("save msg successful"); // true
    console.log(msg); 
  }
  return msg;
};


