const express = require("express");
const router = express.Router();
const Weather = require("../controllers/WeatherController.js");
const weatherController = new Weather();

router.get('/weather',weatherController.getData);

module.exports = router;