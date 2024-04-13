const express = require('express');
const bodyParser = require('body-parser');
const udpServer = require("./utilities/udpServer");
const app = express();
const PORT = process.env.PORT;
const forecast = require("./routes/forecast");
const auth = require("./routes/auth")
const registerip = require("./routes/regip")
const logs = require("./routes/logs")
const sequelize = require("./db/database");
sequelize.authenticate().then();
app.use(bodyParser.json());



// Routes
app.use("/", auth)
app.use("/forecast", forecast);
app.use("/manage", registerip);
app.use("/logs", logs);
// Start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
