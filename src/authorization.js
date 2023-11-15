const readfromdb = require('./database/read')
const bcrypt = require('bcrypt');
const logger = require('../logger')
const statsDClient = require('../metrics')
const readAuthHeaders = (req,res) => {
    const auth = req.headers.authorization;
    if (!auth) {
      return ['', '']
    }
    const [email, password] = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8').split(':');
    return [email, password]
}

const authorizationCheck = async (req, res, next) => {
  try{
    if(req.method == "GET" && req.originalUrl == '/v1/assignments/'){
      statsDClient.increment('assignment_get')
    }
    else if(req.method == "GET"){
      statsDClient.increment('assignment_getbyid')
    }
    else if(req.method == "POST"){
      statsDClient.increment('assignment_post')
    }
    else if(req.method == "PUT"){
      statsDClient.increment('assignment_put')
    }
    else if(req.method == "DELETE"){
      statsDClient.increment('assignment_delete')
    }
    const [email, password] = readAuthHeaders(req,res)
    const user = await readfromdb.findUser(email);
    if (!user) {
        logger.info(`${email} not found - unauthorized`)
        res.status(401).send('Unauthorized');
        return; 
      }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.info(`${password} incorrect - unauthorized`)
      res.status(401).send('Unauthorized');
      return;
    }
    next();
  }
  catch(ex){
    logger.error(`Database service unavailable - ${ex}`)
    res.status(503).send('Service unavailable');
  }
}

module.exports = {readAuthHeaders, authorizationCheck}
