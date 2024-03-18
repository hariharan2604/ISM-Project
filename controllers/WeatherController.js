const WeatherData = require('../models/WeatherData');

class Weather{
    async getData(req, res) {
        try {
            const forecast = await WeatherData.findAll({
                order: [['createdAt', 'DESC']],
                limit: 10
            });
            res.json(forecast);
        }
        catch(err){
            console.error('Error fetching weather data:', err);
            res.status(500).json({ error: 'Internal server error' });
        };
    }
}
module.exports = Weather;