const readfromdb = require('./database/read')
const bcrypt = require('bcrypt');
const logger = require('../logger')
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
    const [email, password] = readAuthHeaders(req,res)
    const user = await readfromdb.findUser(email);
    if (!user) {
        res.status(401).send('Unauthorized');
        return; 
      }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).send('Unauthorized');
      return;
    }
    next();
  }
  catch(ex){
    logger.error("Database service unavailable")
    res.status(503).send('Service unavailable');
  }
}

module.exports = {readAuthHeaders, authorizationCheck}
