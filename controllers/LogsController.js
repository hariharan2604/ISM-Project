const logger = require('../utilities/Logger');
const processLogs = require('../utilities/Logs');

class LogsController {
    getLogs(req, res) {
        try {
            processLogs((logArray) => {
                res.status(200).json({ code: 200, logs: logArray });
            });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ code: 500, logs: null });
        }
    }
}

module.exports = LogsController;
