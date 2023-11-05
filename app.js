const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router()
const app = express();
const {sequelize, createDatabase, syncDatabase, User, Assignment} = require("./src/database/bootstrap")
const insertUser = require('./src/database/insert')
const authenticate = require('./src/database/healthz')
const mysql = require('mysql2')
const database = 'Clouddb'
const authorization = require('./src/authorization')
const assignmentService = require('./src/services/assignmentService')
const logger = require("./logger")
require('dotenv').config();
const port = process.env.PORT
app.use(express.json());

(async () => {
  try {
    await createDatabase();
    await sequelize.sync({ alter: true });
    await insertUser();
  } catch (error) {
    logger.error("Error:", error);
  }
  finally{
    app.listen(port, () => {
      logger.info("Server running on port", port);
    });
  }
})();

User.hasMany(Assignment, {
  foreignKey: 'uid',
});
Assignment.belongsTo(User, {
  foreignKey: 'uid',
});

async function isAuth(req, res, next) {
    await authorization.authorizationCheck(req, res, next)
  }

app.use('/v1/assignments', router)


router.get('/', isAuth, async (req, res) => {
  await assignmentService.getAssignments(req, res)
})

router.get('/:id', isAuth, async (req, res) => {
  await assignmentService.getAssignmentById(req, res)
})

router.post('/', isAuth, async (req, res) => {
    await assignmentService.postAssignment(req, res)
});

router.put('/:id', isAuth, async (req, res) => {
  await assignmentService.updateAssignment(req, res)
})

router.delete('/:id', isAuth, async (req, res) => {
  await assignmentService.deleteAssignment(req, res)
})

router.patch('/*', isAuth, async (req, res) => {
  return res.status(405).end()
})

app.get('/healthz', async (req, res)=>{
  res.setHeader('cache-control', 'no-cache');
    if (Object.keys(req.body).length > 0) {
        return res.status(400).send();
    }
    if (Object.keys(req.query).length > 0){
        return res.status(400).send();
    }
    try{
        await sequelize.authenticate()
        logger.info("Successfully connected to MySQL")
        res.status(200)
    }
    catch(err){
        logger.info("Unable to connect to MySQL", err)
        res.status(503)
    }
    res.end()
});

app.all('/healthz', (req, res) => {
  res.status(405).end();
});

module.exports = app



