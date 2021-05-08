'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();
router.get('/', async (req, res) => {

  let count = 0;

  let getNews = async () => {

    const instance = axios.create({
      baseURL: 'https://developers.coinmarketcal.com/v1'
    });
    
    instance.defaults.headers.common['x-api-key'] = "uNqwYyxmgg1ffxdjNmBnm2RxFLk9iiTf7LDRkZZO";
  
    await instance.get('/events?page=2&sortBy=created_desc&exchanges=binance&categories=8,11,14,4,1,17', {
      timeout: 50000
    });

    console.log("_response.data.body >>");
    count++;
  }

  setInterval(() => {
    if(count < 10) getNews()
  }, 3000);

  return res.status(200).send("OK")


  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.write('<h1>Hello from Express.js!</h1>');
  // res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
