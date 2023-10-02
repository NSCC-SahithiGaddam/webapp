const Sequelize = require('sequelize');
const sequelize = require('../database/bootstrap')
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  account_created: {
    type: Sequelize.DATE
  },
  account_updated: {
    type: Sequelize.DATE
  }},
  {
    createdAt: 'account_created',
    updatedAt: 'account_updated'
  }
);

module.exports = User;