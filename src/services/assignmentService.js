const readfromdb = require('../database/read')
const authorization = require('../authorization')
const assignment = require('../models/Assignment') 

const getAssignments = async(req, res) => {
    try{
    const assignments = await readfromdb.getAssignments()
     res.status(200).json(assignments)
    }
    catch(err){
        res.status(500).send()
    }
}

const getAssignmentById = async(req, res) => {
    try{
        const id = req.params.id
        const assignment = await readfromdb.findAssignment(id)
        if(!assignment){
            res.status(404).send("Invalid Assignment")
            return;
        }
        res.status(200).json(assignment)
    }
catch(err){
    res.status(500).send()
}
}

const postAssignment = async(req, res) => {
    try{
    const [email, password] = authorization.readAuthHeaders(req)
    const user = await readfromdb.findUser(email);
    // validate the request body
    const { name, points, num_of_attempts, deadline,assignment_created,assignment_updated } = req.body;
    if (!name || !points || !num_of_attempts || !deadline) {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    if (assignment_created || assignment_updated) {
        return res.status(403).json({ error: 'You donot have permissions to provide assignment created or updated' });
      }
    // create a new assignment
    const userid = user.uid
    const createAssignment = await assignment.create({
      name,
      points,
      num_of_attempts,
      deadline,
      uid: userid
    })
    .then((createAssignment) => {return res.status(201).json(createAssignment)})
    .catch((err) => {
        return res.status(400).json({message: 'check min and max'})
    })
}
catch(err){
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
      if (assignment_created || assignment_updated) {
        return res.status(403).json({ error: 'You donot have permissions to provide assignment created or updated' });
      }
    await assignment.update({
        "name": name || assignment.name,
        "points": points || assignment.points,
        "num_of_attempts": num_of_attempts || assignment.num_of_attempts,
        "deadline": deadline || assignment.deadline
    })
    .then((assignment)=>{return res.status(200).json(assignment);})
    .catch((err) => {
        return res.status(400).json({message: 'check min and max'})
    })
    }
    catch(err){
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
        res.status(404).send("Invalid Assignment")
        return;
    }
    if(user.uid != assignment.uid){
        res.status(403).send('Forbidden');
        return;
      }
      await assignment.destroy()
      res.status(200).json(assignment);
    }
    catch(err){
        return res.status(500).send()
    }
}

module.exports = {getAssignments, getAssignmentById, postAssignment, updateAssignment, deleteAssignment}