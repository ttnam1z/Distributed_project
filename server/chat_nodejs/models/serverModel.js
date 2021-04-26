var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var ServerData = sequelize.define('Server', {
    // Model attributes are defined here
    id:{
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    port:{
      type: DataTypes.INTEGER
    },
    name:{
      type: DataTypes.STRING(20)
    },
    hashpass: {
      type: DataTypes.STRING(32)
      // allowNull defaults to true
    }
  }, {
    // Other model options go here
    modelName: 'Server', // We need to choose the model name
    tableName: 'Server',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.ServerData = ServerData;
  return ServerData;
};

