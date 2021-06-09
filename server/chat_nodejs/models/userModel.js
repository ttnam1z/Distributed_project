var { Model, DataTypes } = require('sequelize');
module.exports = (sequelize)=>{
  
  var User = sequelize.define('User', {
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
    modelName: 'Customer', // We need to choose the model name
    tableName: 'User',
    timestamps: false //not create createdAt and updateAt timestamps
  });

  // User.comparePassword = (password)=>{
  //   return (password.hashCode() === this.hashpass);
  // }
  // User.sync({force:true}).then(()=>{

  // }).catch(err => {
  //   console.error('Unable to connect to the database:', err);
  // });
  sequelize.models.User = User;
  return User;
};

