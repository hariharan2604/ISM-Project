const WeatherData = require('../models/WeatherData');

class Weather {
    async getData(req, res) {
        try {
            const forecast = await WeatherData.findAll({
                order: [['createdAt', 'DESC']],
            });
            res.json(forecast);
        }
        catch (err) {
            logger.error('Error fetching weather data:', err);
            res.status(500).json({ error: 'Internal server error' });
        };
    }
}
module.exports = Weather;