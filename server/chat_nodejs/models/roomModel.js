const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('distributed_project', 'nam', 'nam_pass', {
  host: '192.168.99.100',
  port:3306,
  dialect: 'mysql'
});


sequelize.authenticate().then(() => {
  console.log('Connection established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
}).finally(() => {
  sequelize.close();
});

module.exports = (sequelize,DataTypes,Model)=>{
  class User extends Model {
    static classLevelMethod() {
      return 'foo';
    }
    instanceLevelMethod() {
      return 'bar';
    }
    getname() {
      return this.name;
    }
  }
  
  User.init({
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
    sequelize, // We need to pass the connection instance
    modelName: 'Customer', // We need to choose the model name
    tableName: 'User' 
  });
  
  // the defined model is the class itself
  console.log(User === sequelize.models.User); // true
  // const jane = await User.create({ name: 'name', hashpass: 'pass' }) //create = buiil + save
  const user = User.build({ name: 'name', hashpass: 'pass' });
  await user.save(); 
  return User;
};

