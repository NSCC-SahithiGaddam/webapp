const express = require('express');
const app = express();
const sequelize = require("./src/database/bootstrap")
const User = require('./src/models/User')
const insert = require('./src/database/insert')
app.use(express.json())
app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
})
sequelize.sync().then(()=> {
    insert()
})


