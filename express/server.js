'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const axios = require('axios');

const router = express.Router();

var corsOptions = {
	origin: ["https://vigorous-visvesvaraya-983c08.netlify.app/home", "https://vigorous-visvesvaraya-983c08.netlify.app", "http://localhost:8080/", "http://localhost:8080"],
  credentials: true,
};

app.use(cors(corsOptions));

router.get('/', async (req, res) => {

  console.log("biri geldi 11 >>");

  const instance = axios.create({
		baseURL: 'https://developers.coinmarketcal.com/v1'
	});
	
	instance.defaults.headers.common['x-api-key'] = "uNqwYyxmgg1ffxdjNmBnm2RxFLk9iiTf7LDRkZZO";

	let _response = await instance.get('/events?page=2&sortBy=created_desc&exchanges=binance&categories=8,11,14,4,1,17', {
		timeout: 50000
	});

  return res.status(200).send(_response.data.body)


  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.write('<h1>Hello from Express.js!</h1>');
  // res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', async (req, res) => {
  

  console.log("biri geldi 22 >>");
  const instance = axios.create({
		baseURL: 'https://developers.coinmarketcal.com/v1'
	});
	
	instance.defaults.headers.common['x-api-key'] = "uNqwYyxmgg1ffxdjNmBnm2RxFLk9iiTf7LDRkZZO";

	let _response = await instance.get('/events?page=2&sortBy=created_desc&exchanges=binance&categories=8,11,14,4,1,17', {
		timeout: 50000
	});

  return res.status(200).send(_response.data.body)
});

module.exports = app;
module.exports.handler = serverless(app);
