const StatsD = require('node-statsd');
const client = new StatsD();

// Configure StatsD to send metrics to the CloudWatch Agent
const cloudWatchAgentHost = 'localhost'; // The host where CloudWatch Agent is running
const cloudWatchAgentPort = 8125; // The default StatsD port used by CloudWatch Agent
client.host = cloudWatchAgentHost;
client.port = cloudWatchAgentPort;

module.exports = client