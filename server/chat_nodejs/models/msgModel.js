var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var MessageList = sequelize.define('Message', {
    // Model attributes are defined here
    id:{
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      references: {
        model: "ChatRoom", // this is the table name
        key: "roomId"
      }
    },
    userGlobal: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserGlobal", // this is the table name
        key: "globalId"
      }
    },
    content:{
      type: DataTypes.STRING(1024)
    },
    timeStamp:{
      type: DataTypes.DATE
    }
  }, {
    // Other model options go here
    modelName: 'Message', // We need to choose the model name
    tableName: 'Message',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.MessageList = MessageList;
  return MessageList;
};

