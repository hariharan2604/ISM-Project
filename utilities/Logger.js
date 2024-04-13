const winston = require('winston');

// Define custom logging levels
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
        iplog: 7 // Define custom level 'iplog'
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'cyan',
        verbose: 'blue',
        debug: 'magenta',
        silly: 'gray',
        iplog: 'white' // Define color for 'iplog'
    }
};

// Add custom levels and colors to Winston
winston.addColors(customLevels.colors);

// Create the logger instance
const logger = winston.createLogger({
    levels: customLevels.levels, // Set custom levels
    level: 'info', // Default logging level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info', format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
        new winston.transports.File({ filename: 'logs/combined.log', format: winston.format.combine(winston.format.timestamp(), winston.format.json()) })
    ]
});

// If not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;
