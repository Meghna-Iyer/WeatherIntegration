const express = require('express');
const request = require('request');
const async = require('async');
const dotenv = require('dotenv')
const extReqService = require('./ExternalReqService');
var bodyParser = require('body-parser');

dotenv.config({ path: './.env'})

const app = express()
const port = process.env.WEATHER_INTEGRATION_PORT

app.use(bodyParser.json());

app.get('/get_forecast', (req, res) => {
  let locationKeys = req.body.keys;
  let weatherResponseList = [];

  async.each(locationKeys,
  (locationKey, callback) => {

    extReqService.getForecast(locationKey, weatherResponseList, (err,body) =>{
      if(err){
        console.log(err)
        res.send(500, {message: 'Errorrrrr!!!!'});
      }
      return callback(null)
    })
  },
  (err) => {
    if(err) {
      console.log(err);
      return res.send(500, { message : 'Errorrrrr!!!!'})
    }
      return res.send(200, weatherResponseList)
    }
  );
});


app.listen(port, () => {
  console.log(`Weather Integration app listening on port ${port}`)
})