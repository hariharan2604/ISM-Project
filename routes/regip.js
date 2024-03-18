const express = require("express");
const router = express.Router();
const RegIP = require("../controllers/RegisterIPContoller.js");
const regIP = new RegIP();
const verifymiddleware = require("../middlewares/Auth.js");
// router.use(verifymiddleware);

router.post('/registerip', regIP.registerIP);
router.get('/checkip/:ip',regIP.checkIP)
module.exports = router;