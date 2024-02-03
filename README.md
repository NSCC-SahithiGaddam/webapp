webapp
Prerequisites softwares and libraries
MySQL DB
NodeJS (Version 20)
Sequelize (3rd party package for ORM in Node)
bcryptjs
express
mocha
sequelize
supertest
Steps to deploy it locally.
clone fork repo: git clone git@github.com:sahithir27/webapp.git

run npm install to install packages


DB_HOSTNAME = localhost
DB_PASSWORD = password
DB_USER = root
DB_NAME = Clouddb
DB_DIALECT = mysql
APP_PORT = 3000


run appliation: npm start (npm node app.js)

Application Testing
npm test : this runs test on tests/integration/database.healthz.js
