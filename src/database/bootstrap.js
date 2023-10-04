const Sequelize = require('sequelize')
const config = require('../../config/config.json')



const sequelize = new Sequelize(
  'Clouddb', 'root', 'password', 
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);

module.exports = sequelize