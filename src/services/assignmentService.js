const readfromdb = require('../database/read')
const authorization = require('../authorization')
const {Assignment} = require('../database/bootstrap')
const logger = require('../../logger')

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
            logger.warn(`Invalid Assignment id ${id}`)
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
      return res.status(400).json({ message: 'Invalid request body' });
    }

    if(typeof name !== 'string'){
        return res.status(400).json({message: 'Name must be string'})
    }

    if(!Number.isInteger(num_of_attempts)){
        return res.status(400).json({message: 'Number of attempts should be integer'})
    }
    if(typeof deadline !== 'string' || isNaN(Date.parse(deadline))){
        return res.status(400).json({message: 'deadline should be a date string'})
    }

    if (assignment_created || assignment_updated) {
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
        logger.info(`Successfully posted assignment id: ${createAssignmentWithoutUid.id}`)
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
        logger.warn(`Invalid Assignment id ${id}`)
        res.status(404).send("Invalid Assignment")
        return;
    }
    if(user.uid != assignment.uid){
      res.status(403).send('Forbidden');
      return;
    }
    if (!name || !points || !num_of_attempts || !deadline) {
        return res.status(400).json({ message: 'Invalid request body' });
    }
    
    if(typeof deadline !== 'string'){
        return res.status(400).json({message: 'Name must be string'})
    }

    if(!Number.isInteger(num_of_attempts)){
        return res.status(400).json({message: 'Number of attempts should be integer'})
    }

    if(typeof deadline !== 'string' || isNaN(Date.parse(deadline))){
        return res.status(400).json({message: 'deadline should be a date string'})
    }

    if (assignment_created || assignment_updated) {
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
        logger.warn(`Invalid Assignment id ${id}`)
        res.status(404).send("Invalid Assignment")
        return;
    }
    if(user.uid != assignment.uid){
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

module.exports = {getAssignments, getAssignmentById, postAssignment, updateAssignment, deleteAssignment}