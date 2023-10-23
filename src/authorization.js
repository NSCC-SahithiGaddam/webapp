const readfromdb = require('./database/read')
const bcrypt = require('bcrypt');
const readAuthHeaders = (req,res) => {
    const auth = req.headers.authorization;
    if (!auth) {
      return ['', '']
    }
    const [email, password] = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8').split(':');
    return [email, password]
}

const authorizationCheck = async (req, res, next) => {
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

module.exports = {readAuthHeaders, authorizationCheck}
