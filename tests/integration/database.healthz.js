const authenticate = require('../../src/database/healthz')
const http = require('http');

const server = http.createServer(async (req, res) => {
    await authenticate(req, res);
  });

const testReq = http.request({
    method: 'GET',
    host: 'localhost',
    path: '/healthz',
    port: 3000, 
  }, (res) => {
    if (res.statusCode === 200) {
      console.log('Test Passed: Successful authentication returns 200');
    } else {
      console.error('Test Failed: Successful authentication should return 200');
    }
  });
  
  testReq.end();

  server.close(() => {
    console.log('All tests completed. Server closed.');
  });


