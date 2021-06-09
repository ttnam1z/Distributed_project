var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var UserLocal = sequelize.define('UserLocal', {
    // Model attributes are defined here
    id:{
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    hashpass: {
      type: DataTypes.STRING(32)
      // allowNull defaults to true
    }
  }, {
    // Other model options go here
    modelName: 'UserLocal', // We need to choose the model name
    tableName: 'UserLocal',
    timestamps: false
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.UserLocal = UserLocal;
  return UserLocal;
};

