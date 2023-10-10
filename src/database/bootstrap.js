const config = require('../../config/config.json')
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
const UserModel = require("../models/User");
const AssignmentModel = require("../models/Assignment");

require('dotenv').config();
// const database = process.env.database
// const user = process.env.username
// const password = process.env.password
// const dialect = process.env.dialect
// const host = process.env.host

const sequelize = new Sequelize(
  "Clouddb", "root", "password", 
  {
    dialect: "mysql",
    host: "127.0.0.1"
  })

const User = UserModel(sequelize);
const Assignment = AssignmentModel(sequelize);

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log("Models synchronized successfully.");
};

const createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
};

module.exports = {
  sequelize,
  createDatabase,
  syncDatabase,
  User,
  Assignment,
};
