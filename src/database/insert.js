const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('../database/bootstrap')
const user = require('../models/User');

const csvFilePath = './users.csv';
const finduser = async (email) => {
    const userdata = await user.findOne({where: {email: email}})
    if(userdata){
        return true
    }
    else return false
}
const insert_into_db = async () => {
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (data) => {
      const isUserExists = await finduser(data.email)
      if(!isUserExists){
        user.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password
          })
            .then((record) => {
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
