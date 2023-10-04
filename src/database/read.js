const sequelize = require('../database/bootstrap')
const user = require('../models/User');
const assignment = require('../models/Assignment')

const findUser = async (email) => {
    const userdata = await user.findOne({where: {email: email}})
    return userdata
}

const findAssignment = async (id) => {
    const assignmentdata = await assignment.findOne({where: {id: id}})
    return assignmentdata
}

const getAssignments = async () => {
    const assignmentdata = await assignment.findAll()
    return assignmentdata
}

module.exports = {findUser, findAssignment, getAssignments}