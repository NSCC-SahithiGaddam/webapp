const Sequelize = require('sequelize');
const sequelize = require('../database/bootstrap')
const User = sequelize.define('User', {
  uid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false
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
    writeonly: true
  },
  account_created: {
    type: Sequelize.DATE,
    readonly: true
  },
  account_updated: {
    type: Sequelize.DATE,
    readonly: true
  }},
  {
    createdAt: 'account_created',
    updatedAt: 'account_updated'
  }
);
module.exports = User;