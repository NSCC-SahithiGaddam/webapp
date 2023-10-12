const fs = require('fs');
const csv = require('csv-parser');
const {User, Assignment} = require('../database/bootstrap')

const bcrypt = require("bcrypt")
const saltRounds = 10
require('dotenv').config();
const csvFilePath = process.env.CSV_FILE;
const finduser = async (email) => {
    const userdata = await User.findOne({where: {email: email}})
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
        User.create({
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
