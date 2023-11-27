const AWS = require('aws-sdk');
const logger = require('../../logger')
require('dotenv').config();
const topicARN = process.env.SNS_TOPIC_ARN

AWS.config.update({ region: 'us-west-1', 
accessKeyId: 'AKIAZHA4YEBPBQVTAV5S', 
secretAccessKey: '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'});

const sns = new AWS.SNS();
const createTopic = (submission_url, email) => {
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

module.exports = {createTopic}