var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var RoomTime = sequelize.define('RoomTime', {
    // Model attributes are defined here
    id:{
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    roomid: {
      type: DataTypes.INTEGER,
      references: {
        model: "ChatRoom", // this is the table name
        key: "id"
      }
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserGlobal", // this is the table name
        key: "globalId"
      }
    },
    leftTime: {
      type:DataTypes.DATE,
      allowNull: false,
      defaultValue:"1000-01-01 00:00:00.000000"
    }
  }, {
    // Other model options go here
    modelName: 'RoomTime', // We need to choose the model name
    tableName: 'RoomTime',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.RoomTime = RoomTime;
  return RoomTime;
};

