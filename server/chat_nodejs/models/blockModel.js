var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var BlockList = sequelize.define('BlockList', {
    // Model attributes are defined here
    id:{
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserGlobal", // this is the table name
        key: "globalId"
      }
    },
    blockedUser: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserGlobal", // this is the table name
        key: "globalId"
      }
    },
    timeStart:{
      type: DataTypes.DATE
    }
  }, {
    // Other model options go here
    modelName: 'BlockList', // We need to choose the model name
    tableName: 'BlockList',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.BlockList = BlockList;
  return BlockList;
};

