const https = require('https');

exports.handler = async (event) => {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_dGFrFEM1zVIDc-hUfWsKGAEMFLaQMqfjACS2Z2be5aM0ZtcdtcGqUF8dZ8ZfFgQ94iZbevxnaS5H/pub?gid=0&single=true&output=csv';

  return new Promise((resolve) => {
    https.get(SHEET_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Access-Control-Allow-Origin': '*'
          },
          body: data
        });
      });
    }).on('error', (e) => {
      resolve({ statusCode: 500, body: 'Error: ' + e.message });
    });
  });
};
