const sequelize = require('./bootstrap')
const authenticate = async (req, res) => {
    res.setHeader('cache-control', 'no-cache');
    if (Object.keys(req.body).length > 0) {
        return res.status(400).send();
    }
    if (Object.keys(req.query).length > 0){
        return res.status(400).send();
    }
    try{
        await sequelize.authenticate()
        console.log("Successfully connected to MySQL")
        res.status(200)
    }
    catch(err){
        console.log("Unable to connect to MySQL", err)
        res.status(503)
    }
    res.end()
}

module.exports = authenticate