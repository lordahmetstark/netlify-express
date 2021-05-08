'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const axios = require('axios');
const Binance = require('node-binance-api');

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

  let data = {
    type: 1,
    result: _response.data
  }

  return res.status(200).send(data)


  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.write('<h1>Hello from Express.js!</h1>');
  // res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/events', async (req, res) => {

  const instance = axios.create({
		baseURL: 'https://developers.coinmarketcal.com/v1'
	});
	
	instance.defaults.headers.common['x-api-key'] = "uNqwYyxmgg1ffxdjNmBnm2RxFLk9iiTf7LDRkZZO";

	let _response = await instance.get('/events?sortBy=created_desc&exchanges=binance&categories=8,11,14,4,1,17', {
		timeout: 50000
	});

  let data = {
    type: 2,
    result: _response.data
  }

  return res.status(200).send(data)
});

app.use('/bought-coins-for-emre', async (req, res) => {

  let form = req.body
  console.log("form >>", form);

  const binance = new Binance().options({
    APIKEY: '4UDze17OgB1uVkCSmWWNB2bU4uIBiBSEl80p9TC9f3u9lAMRCYb8kmteXbPnJI2s',
    APISECRET: 'stlqg9MndDaWFRVAzsjBXkwViaKpsoLoPp3d5Z41xXnym9liOfgOJBU31nVM1XlP'
  });

  let data = {
    result: {},
    message: null
  }

	async function getPrice() {
		try {

      let price = await binance.prices(`${form.coin}${form.base}`);

			return price;

		} catch (err) {
			return false;
		}
	}

  let price = await getPrice();
  if(!price) {
    data.message = 'Bu coin yok.'
    return res.status(200).send(data)
  }
  price = parseFloat(price[`${form.coin}${form.base}`])
  console.log("price >>", price)


  let balances = await binance.balance();
  console.log("_balances[form.coin] 11 >>", balances[form.coin]);
  let availablePrice = parseFloat(balances[form.coin].available);
  console.log("availablePrice 11 >>", availablePrice);

  // if(availablePrice > 0.01) {
  //   data.message = 'Bundan zaten almışsın.'
  //   return res.status(200).send(data)
  // }


  // let myFund = parseFloat(balances[form.base].available);
  // if(myFund < form.budget) {
  //   data.message = 'Hesabında para yok aq fakiri.'
  //   return res.status(200).send(data)
  // }

  let PositionSize = Math.floor(form.budget / price);
  console.log("PositionSize >>", PositionSize);


  let stopPrice = price - ((price / 100) * form.stopDistance)
  stopPrice = parseFloat(stopPrice.toFixed(4))
  let stopPriceLimit = parseFloat((stopPrice * 0.9).toFixed(4))
  console.log("stopPrice >>", stopPrice);
  console.log("stopPriceLimit >>", stopPriceLimit);


  let tpPrice = price + ((price / 100) * form.tpDistance)
  tpPrice = parseFloat(tpPrice.toFixed(4))
  let tpPriceLimit = parseFloat((tpPrice * 0.9).toFixed(4))
  console.log("tpPrice >>", tpPrice);
  console.log("tpPriceLimit >>", tpPriceLimit);


  // let buyProccess = await binance.marketBuy(`${form.coin}${form.base}`, PositionSize);
  // console.log("buyProccess >>", buyProccess);

  let _balances = await binance.balance();
  console.log("_balances[form.coin] 22 >>", _balances[form.coin]);
  let availablePriceAfter = parseFloat(_balances[form.coin].available) * 0.99;
  availablePriceAfter = parseFloat(availablePriceAfter.toFixed(2))
  console.log("availablePriceAfter 22 >>", availablePriceAfter);


  // let tpProccess = await binance.sell(`${form.coin}${form.base}`, availablePriceAfter, tpPriceLimit, {stopPrice: tpPrice, type: "TAKE_PROFIT_LIMIT"});
  // console.log("tpProccess >>", tpProccess);

  // binance.sell(`${form.coin}${form.base}`, availablePriceAfter, tpPriceLimit, {stopPrice: tpPrice, type: "TAKE_PROFIT_LIMIT"}, (error, response) => {
  //   console.log("error >>", error ? error.body : '');
  //   // console.log("response >>", response);
  // });

  let stopProccess = await binance.sell(`${form.coin}${form.base}`, availablePriceAfter, stopPriceLimit, {stopPrice: stopPrice, type: "STOP_LOSS_LIMIT"});
  console.log("stopProccess >>", stopProccess);

  setTimeout(() => {
    return res.status(200).send(data)
  }, 1000);

});

app.use('/bought-coins-for-ahmet', async (req, res) => {

  let form = req.body
  console.log("form >>", form);

  const binance = new Binance().options({
    APIKEY: 'dJ26515PgWOR6OeGPZq1w2gSZjT15VIK0w7als1elKnlzL8W6otqpKVMOdtU9iec',
    APISECRET: 'bNgVNL4z8s1vZdJYJ7EZRG7vtpLfLGHeBvbvVGzrgVt4wnlxG8bEfwQNVXlhkJGl'
  });

  let data = {
    result: {},
    message: null
  }

	async function getPrice() {
		try {

      let price = await binance.prices(`${form.coin}${form.base}`);

			return price;

		} catch (err) {
			return false;
		}
	}

  let price = await getPrice();
  if(!price) {
    data.message = 'Bu coin yok.'
    return res.status(200).send(data)
  }
  console.log("price >>", price)


  let balances = await binance.balance();
  console.log("balances >>", balances);

  let status = balances[form.coin];
  if(!status) {
    data.message = 'Bu coin cüzdanda bulunamadı.'
    return res.status(200).send(data)
  }
  console.log("status >>", status);







  // binance.prices('ETNUSDT', (error, ticker) => {
  //   console.log("ETNUSDT error >>", error)
  //   console.info("Price of BNB: ", ticker.BNBBTC);
  //   console.info("Price of BNB: ", ticker);
  // });

  // let price = await binance.prices(`ETNUSDT`);
  // data.result.price = price;





  data.result.balances = balances;




  // data.result.futures = await binance.futuresPrices() 

  // await binance.openOrders(false, (error, openOrders) => {
  //   data.result.opens = openOrders;
  // });

  // await binance.trades("BTCUSDT", (error, trades, symbol) => {
  //   data.result.trades = trades;
  // });

  

  setTimeout(() => {
    return res.status(200).send(data)
  }, 1000);


});

module.exports = app;
module.exports.handler = serverless(app);
