const express = require("express");
const router = express.Router();
const Weather = require("../controllers/WeatherController.js");
const weatherController = new Weather();
const verifymiddleware = require("../middlewares/Auth.js");
// router.use(verifymiddleware);

router.get('/weather',weatherController.getData);

module.exports = router;