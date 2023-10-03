const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('../database/bootstrap')
const user = require('../models/User');

const bcrypt = require("bcrypt")
const saltRounds = 10

const csvFilePath = './users.csv';
const finduser = async (email) => {
    const userdata = await user.findOne({where: {email: email}})
    if(userdata){
        return true
    }
    else return false
}

const encryptPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword
}

const insert_into_db = async () => {
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (data) => {
      const isUserExists = await finduser(data.email)
      const encryptedPassword = await encryptPassword(data.password)
      if(!isUserExists){
        user.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: encryptedPassword
          })
            .then(() => {
              console.log('Record inserted');
            })
            .catch((error) => {
              console.error('Error inserting record:', error);
            });
      }
      else{
        console.error('User already exists')
      }
      
    })
    .on('end', () => {
      console.log('CSV data import complete.');
    });
}
  module.exports = insert_into_db
