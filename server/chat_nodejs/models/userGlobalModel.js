var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var UserGlobal = sequelize.define('UserGlobal', {
    // Model attributes are defined here
    globalId:{
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER
    },
    name:{
      type: DataTypes.STRING(20)
    },
    serverId:{
      type: DataTypes.INTEGER,
      references: {
        model: "Server", // this is the table name
        key: "id"
      }
    },
    hashpass: {
      type: DataTypes.STRING(32)
      // allowNull defaults to true
    }
  }, {
    // Other model options go here
    modelName: 'UserGlobal', // We need to choose the model name
    tableName: 'UserGlobal',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.UserGlobal = UserGlobal;
  return UserGlobal;
};

