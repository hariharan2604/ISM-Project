const express = require("express");
const router = express.Router();
const Logs = require("../controllers/LogsController.js");
const getLog = new Logs();

router.get('/getlogs', getLog.getLogs);

module.exports = router;