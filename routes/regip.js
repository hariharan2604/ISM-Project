const express = require("express");
const router = express.Router();
const RegIP = require("../controllers/RegisterIPContoller.js");
const regIP = new RegIP();

router.post('/registerip', regIP.registerIP);
router.post('/checkip', regIP.checkIP);
router.post('/blacklistip', regIP.blacklistIP);
router.post('/whitelistip', regIP.whitelistIP);
router.post('/verifyOTP', regIP.verifyOTP);
router.get('/registeredip', regIP.registeredIP);
router.get('/blacklistedip', regIP.blacklistedIP);

module.exports = router;