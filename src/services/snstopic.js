const AWS = require('aws-sdk');
const logger = require('../../logger')
require('dotenv').config();
const topicARN = process.env.SNS_TOPIC_ARN
const aws_region = process.env.AWS_REGION
const sns = new AWS.SNS();
AWS.config.update({ region: aws_region });
const publishMessage = (submission_url, email) => {
    const messageObject = {
        submissionUrl: submission_url,
        userEmail: email
      };
    const messageString = JSON.stringify(messageObject);
    const snsParams = {
        Message: messageString,
        TopicArn: topicARN,
      };
      sns.publish(snsParams, (err, data) => {
        if (err) {
          logger.error(`Error publishing message to SNS: ${err}`);
        } else {
          logger.info(`Message published to SNS successfully. MessageId: ${data.MessageId}`);
        }
      });
}

module.exports = {publishMessage}