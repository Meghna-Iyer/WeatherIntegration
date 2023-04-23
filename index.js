const express = require('express');
const request = require('request');
const async = require('async');
var bodyParser = require('body-parser');

const app = express()
const port = 5005

app.use(bodyParser.json());

function Weather(locationKey, text, temperatureMin, temperatureMax, day, night, link) {
  var weather = {};

  weather.locationKey = locationKey;
  weather.text = text;
  weather.temperatureMin = temperatureMin;
  weather.temperatureMax = temperatureMax;
  weather.day = day;
  weather.night = night;
  weather.link = link;

  return weather;

}

app.get('/get_forecast', (req, res) => {
  let locationKeys = req.body.keys;
  let weatherResponseList = [];

  async.each(locationKeys,
  (locationKey, callback) => {

    const apiKey = "kGlgZ6GAKAAfkJYiERnEyq3jEJufpLEb";
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}`;

    request(url, (err, response, body) => {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        if (response.statusCode == 200) {
          let data = JSON.parse(body);
          let dailyForecast =  data.DailyForecasts[0],
            weather = new Weather(locationKey,
              data.Headline.Text,
              dailyForecast.Temperature.Minimum.Value,
              dailyForecast.Temperature.Maximum.Value,
              dailyForecast.Day.IconPhrase,
              dailyForecast.Night.IconPhrase,
              dailyForecast.Link);

          weatherResponseList.push(weather)

          return callback(null);
        } else {
          return callback(response.statusCode);
        }
      }
    });
  },
  (err) => {
    if(err) {
      return res.send(500, { message : 'Errorrrrr!!!!'})
    }
      return res.send(200, weatherResponseList)
    }
  );
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})