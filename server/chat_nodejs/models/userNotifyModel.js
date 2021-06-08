var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var UserNotify = sequelize.define('UserNotify', {
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
    type: {
      type:DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    info: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserGlobal", // this is the table name
        key: "globalId"
      }
    }
  }, {
    // Other model options go here
    modelName: 'UserNotify', // We need to choose the model name
    tableName: 'UserNotify',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.UserNotify = UserNotify;
  return UserNotify;
};

