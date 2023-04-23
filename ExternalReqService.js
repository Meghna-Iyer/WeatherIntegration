const request = require('request')
const dotenv = require('dotenv')

dotenv.config({ path: './.env'})

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

module.exports = {
    getForecast: (locationKey, weatherResponseList, callback) => {

    var url = process.env.GET_FORECAST_EXTERNAL_BASE_URL + locationKey + '?apikey=' + process.env.EXTERNAL_API_KEY
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
            console.log(err);
            return callback(response.statusCode);
          }
        }
      });
    }
}