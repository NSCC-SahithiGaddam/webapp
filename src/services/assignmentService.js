const readfromdb = require('../database/read')
const authorization = require('../authorization')
const {Assignment, Submission} = require('../database/bootstrap')
const logger = require('../../logger')
const snstopic = require('./snstopic')

const getAssignments = async(req, res) => {
    try{
    const assignments = await readfromdb.getAssignments()
    logger.info('Successfully fetched assignments')
     res.status(200).json(assignments)
    }
    catch(err){
        logger.error(`Error fetching assignments ${err}`)
        res.status(500).send()
    }
}

const getAssignmentById = async(req, res) => {
    try{
        const id = req.params.id
        const assignment = await readfromdb.findAssignment(id)
        if(!assignment){
            logger.info(`Invalid Assignment id ${id}`)
            res.status(404).send("Invalid Assignment")
            return;
        }
        const assignmentWithoutUid = { ...assignment.toJSON() };
        delete assignmentWithoutUid.uid;
        logger.info(`Successfully fetched assignment id: ${id}`)
        res.status(200).send(assignmentWithoutUid)
    }
catch(err){
    logger.error(`Error fetching assignment for id: ${req.params.id} - ${err}`)
    res.status(500).send()
}
}

const postAssignment = async(req, res) => {
    try{
    const [email, password] = authorization.readAuthHeaders(req)
    const user = await readfromdb.findUser(email);
    const { name, points, num_of_attempts, deadline,assignment_created,assignment_updated } = req.body;
    if (!name || !points || !num_of_attempts || !deadline) {
        logger.info("Invalid input - Enter all fields")
        return res.status(400).json({ message: 'Invalid request body' });
    }

    if(typeof name !== 'string'){
        logger.info(`Invalid input ${name} - Name must be string`)
        return res.status(400).json({message: 'Name must be string'})
    }

    if(!Number.isInteger(num_of_attempts)){
        logger.info(`Invalid input ${num_of_attempts} - Number of attempts should be integer`)
        return res.status(400).json({message: 'Number of attempts should be integer'})
    }
    if(typeof deadline !== 'string' || isNaN(Date.parse(deadline))){
        logger.info(`Invalid input ${deadline} - deadline should be a date string`)
        return res.status(400).json({message: 'deadline should be a date string'})
    }

    if (assignment_created || assignment_updated) {
        logger.info("Invalid input - You do not have permissions to provide assignment created or updated")
        return res.status(403).json({ error: 'You do not have permissions to provide assignment created or updated' });
      }
    
    const userid = user.uid
    const createAssignment = await Assignment.create({
      name,
      points,
      num_of_attempts,
      deadline,
      uid: userid
    })
    .then((createAssignment) => {
        const createAssignmentWithoutUid = { ...createAssignment.toJSON() };
        delete createAssignmentWithoutUid.uid;
        logger.info(`Successfully posted assignment id: ${createAssignmentWithoutUid.assignment_id}`)
        return res.status(201).send(createAssignmentWithoutUid)})
    .catch((err) => {
        logger.error(`Error posting assignment ${err}`)
        return res.status(400).send()
    })
}
catch(err){
    logger.error(`Error posting assignment ${err}`)
    return res.status(500).send()
}
}

const updateAssignment = async(req, res) => {
    try{
    const [email, password] = authorization.readAuthHeaders(req)
    const user = await readfromdb.findUser(email);
    const { name, points, num_of_attempts, deadline,assignment_created, assignment_updated } = req.body;
    const id = req.params.id
    const assignment = await readfromdb.findAssignment(id)
    if(!assignment){
        logger.info(`Invalid Assignment id ${id}`)
        res.status(404).send("Invalid Assignment")
        return;
    }
    if(user.uid != assignment.uid){
        logger.info(`User ${user.uid} Forbidden to update ${assignment.uid}`)
        res.status(403).send('Forbidden');
      return;
    }
    if (!name || !points || !num_of_attempts || !deadline) {
        logger.info("Invalid input - Enter all fields")
        return res.status(400).json({ message: 'Invalid request body' });
    }
    
    if(typeof name !== 'string'){
        logger.info(`Invalid input ${name} - Name must be string`)
        return res.status(400).json({message: 'Name must be string'})
    }

    if(!Number.isInteger(num_of_attempts)){
        logger.info(`Invalid input ${num_of_attempts} - Number of attempts should be integer`)
        return res.status(400).json({message: 'Number of attempts should be integer'})
    }

    if(typeof deadline !== 'string' || isNaN(Date.parse(deadline))){
        logger.info(`Invalid input ${deadline} - deadline should be a date string`)
        return res.status(400).json({message: 'deadline should be a date string'})
    }

    if (assignment_created || assignment_updated) {
        logger.info("Invalid input - You do not have permissions to provide assignment created or updated")
        return res.status(403).json({ error: 'You do not have permissions to provide assignment created or updated' });
    }
    await assignment.update({
        "name": name || assignment.name,
        "points": points || assignment.points,
        "num_of_attempts": num_of_attempts || assignment.num_of_attempts,
        "deadline": deadline || assignment.deadline
    })
    .then(()=>{
        logger.info(`Successfully updated assignment id: ${id}`)
        return res.status(204).send()})
    .catch((err) => {
        logger.error(`Error updating assignment ${err}`)
        return res.status(400).json({message: 'check min and max'})
    })
    }
    catch(err){
        logger.error(`Error updating assignment ${err}`)
        return res.status(500).send()
    }
}

const deleteAssignment = async (req, res) => {
    try{
    const [email, password] = authorization.readAuthHeaders(req)
    const user = await readfromdb.findUser(email);
    const id = req.params.id
    const assignment = await readfromdb.findAssignment(id)
    if(!assignment){
        logger.info(`Invalid Assignment id ${id}`)
        res.status(404).send("Invalid Assignment")
        return;
    }
    if(user.uid != assignment.uid){
        logger.info(`User ${user.uid} Forbidden to update ${assignment.uid}`)
        res.status(403).send('Forbidden');
        return;
      }
      await assignment.destroy()
      logger.info(`Successfully deleted assignment id: ${id}`)
      return res.status(204).send();
    }
    catch(err){
        logger.error(`Error updating assignment ${err}`)
        return res.status(500).send()
    }
}

const submitAssignment = async(req, res) => {
    try{
        const id = req.params.id
        const [email, password] = authorization.readAuthHeaders(req)
        const assignment = await readfromdb.findAssignment(id)
        if(!assignment){
            logger.info(`Invalid Assignment id ${id}`)
            res.status(404).send("Invalid Assignment")
            return;
        }
        const {submission_url} = req.body
        if(!submission_url){
            logger.info("Invalid input - submission url is not passed")
            return res.status(400).json({ message: 'Invalid request body' });
        }
        const submission_count = await Submission.count({
            where: {
                assignment_id: id
              }
        })
        const currentDate = new Date()
        if(submission_count < 3 && assignment.deadline > currentDate){
            const submitAssignment = await Submission.create({
                submission_url,
                assignment_id: id
            })
            .then((submitAssignment) => {
                snstopic.createTopic(submission_url, email)
                logger.info(`Successfully submitted assignment id: ${submitAssignment.submission_id}`)
                return res.status(201).send(submitAssignment)})
            .catch((err) => {
                logger.error(`Error posting assignment ${err}`)
                return res.status(400).send()
            })
        }
        else{
            logger.info(`Max submissions reached for assignment ${id}`)
            return res.status(400).json({ message: 'Unable to submit assignment' });
        }
    }
    catch(err){
        logger.error(`Error submitting assignment ${err}`)
        return res.status(500).send()
    }
}

module.exports = {getAssignments, getAssignmentById, postAssignment, updateAssignment, deleteAssignment, submitAssignment}