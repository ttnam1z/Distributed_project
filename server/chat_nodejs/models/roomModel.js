var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var ChatRoom = sequelize.define('ChatRoom', {
    // Model attributes are defined here
    id:{
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userGlobal1: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserGlobal", // this is the table name
        key: "globalId"
      }
    },
    userGlobal2: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserGlobal", // this is the table name
        key: "globalId"
      }
    }
  }, {
    // Other model options go here
    modelName: 'ChatRoom', // We need to choose the model name
    tableName: 'ChatRoom',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.ChatRoom = ChatRoom;
  return ChatRoom;
};

