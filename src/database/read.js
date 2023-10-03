const sequelize = require('../database/bootstrap')
const user = require('../models/User');

const findUser = async (email) => {
    const userdata = await user.findOne({where: {email: email}})
    return userdata
}

module.exports = findUser