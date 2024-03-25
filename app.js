const express = require('express');
const bodyParser = require('body-parser');
const udpServer = require("./utilities/udpServer");
const app = express();
const PORT = process.env.PORT;
const forecast = require("./routes/forecast");
const auth = require("./routes/auth")
const registerip = require("./routes/regip")
const sequelize = require("./db/database");
const logger = require('./utilities/Logger');
sequelize.authenticate().then();
app.use(bodyParser.json());



// Routes
app.use("/",auth)
app.use("/forecast", forecast);
app.use("/manage", registerip);
// Start the Express server
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});
