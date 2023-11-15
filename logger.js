 const { createLogger, format, transports, config } = require('winston');
 const { combine, timestamp, json } = format;

const logger = createLogger({
    format: combine(
        json()
      ),
   transports: [
       new transports.Console(),
       new transports.File({ filename: './log/webapp.log' })
     ]
 });
 module.exports = logger;