const {User, Assignment} = require('../database/bootstrap')

const findUser = async (email) => {
    const userdata = await User.findOne({where: {email: email}})
    return userdata
}

const findAssignment = async (id) => {
    const assignmentdata = await Assignment.findOne({where: {id: id}})
    return assignmentdata
}

const getAssignments = async () => {
    const assignmentdata = await Assignment.findAll()
    return assignmentdata
}

module.exports = {findUser, findAssignment, getAssignments}