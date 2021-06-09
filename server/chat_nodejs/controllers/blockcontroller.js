var { Sequelize, Model, DataTypes } = require('sequelize');

module.exports.blockUser = async (sequelize,info)=>{
  var blockModel = sequelize.models.BlockList;
  console.log("block user", info)
  var gtime = new Date();
  var block = blockModel.build({user: info.user,blockedUser:info.blockedUser,timeStart:gtime});
  await block.save();
  console.log("done save block" + block.blockedUser);

  // Check create ok
  block = await blockModel.findOne({ where: { user:info.user, blockedUser:info.blockedUser } });
  if (block === null){
    console.log("save fail")
  } else{
    console.log("save successfully")
    console.log(block)
  }
  return block;
};

module.exports.unblockUser = async (sequelize,info)=>{
  var blockModel = sequelize.models.BlockList;

  var result = await blockModel.destroy({
    where : {user:info.user, blockedUser:info.blockedUser}
  });

  // Check delete ok:
  if (result === null){
    console.log("delete block 1")
  } else{
    console.log("delete block 2")
    console.log(result)
  }
  return result;
}

module.exports.getBlockUsers = async (sequelize,info)=>{
  console.log("get block users",info)
  var blockModel = sequelize.models.BlockList;

  var result = await blockModel.findAll({attributes: ['blockedUser','timeStart'],where:{user:info.user}})
  if(result == null){
    console.log("cant get all block info")
  }
  //console.log(result.every(block => block instanceof blockModel)); // true
  console.log("All block info:"); //, JSON.stringify(result, null, 2)
  console.log(result)
  return result;
}


module.exports.getAllBlocks = async (sequelize)=>{
  console.log("get all block")
  var blockModel = sequelize.models.BlockList;

  var result = await blockModel.findAll();
  return result;
}

module.exports.getBlockUser = async (sequelize,info)=>{
  console.log("get block users",info)
  var blockModel = sequelize.models.BlockList;

  var result = await blockModel.findOne({attributes: ['blockedUser','timeStart'],where:{
    user:info.user, 
    blockedUser:info.blockedUser
  }})
  if(result == null){
    console.log("get block info fail")
  }
  //console.log(result.every(block => block instanceof blockModel)); // true
  console.log("block info:");
  console.log(result)
  return result;
}

