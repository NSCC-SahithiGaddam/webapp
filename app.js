const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const sequelize = require("./src/database/bootstrap")
const User = require('./src/models/User')
const insertUser = require('./src/database/insert')
const findUser = require('./src/database/read')

app.use(express.json())
app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
})
sequelize.sync({alter: true}).then(()=> {
    insertUser() 
})

// Middleware for Basic Authentication
async function isAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
      res.status(401).send('Unauthorized');
      return;
    }
    const [email, password] = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8').split(':');
    const user = await findUser(email);
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

app.use(isAuth);

// Authenticated endpoint
app.get('/assignments', isAuth, (req, res) => {
  res.json({ message: 'This is an authenticated endpoint.' });
});



