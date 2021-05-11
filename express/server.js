'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const axios = require('axios');
const Binance = require('node-binance-api');
const nodemailer = require("nodemailer");

const router = express.Router();

var corsOptions = {
	origin: ["https://algotrade-client.app/home", "https://algotrade-client.app", "http://localhost:8080/", "http://localhost:8080"],
  credentials: true,
};

let sendMail = async (form, price) => {

  let smtp = {
		user: "ahmet.olgun@faradayyazilim.com",
		secure: true,
		host: "smtp.yandex.com.tr",
		port: 465,
    auth: {
      user: "ahmet.olgun@faradayyazilim.com",
      pass: "1986Fm*-13-*"
    }
	}

	let transporter = nodemailer.createTransport(smtp);

  let _date = new Date().toLocaleString("tr-TR", {timeZone: "Greenwich"});
  let __date = new Date().toLocaleString("tr-TR", {timeZone: "Turkey"});

	let mailTemplate = `<!doctype html> <html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>Gulf Sigorta </title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #34495e !important; } .btn-primary a:hover { background-color: #34495e !important; border-color: #34495e !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview. </span> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp; </td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Alınan coin: ${form.coin}</p>
  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Base: ${form.base}</p>
  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Price: ${price}</p>
  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Tarih GMT-0: ${_date}</p>
  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Tarih GMT-3: ${__date}</p>
  </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp; </td> </tr> </table> </body> </html>`;

  let mailOptions = {
		from: "ahmet.olgun@faradayyazilim.com",
		to: "ahmetolgun1986@gmail.com,emreakadal@gmail.com",
		subject: `${form.coin} satın alındı`,
		text: `${form.coin} satın alındı`,
		html: mailTemplate
	};

  return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log('email error', error);
				return reject(error);
			}
			console.log('Message %s sent: %s', info.messageId, info.response);
			return resolve(info);
		});
	});



}

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

  sendMail(form, price);
  return res.status(200).send("OK")



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
