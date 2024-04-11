const winston = require('winston');

// Define the Winston logger configuration
const logger = winston.createLogger({
    level: 'info', // Default logging level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to logs
        winston.format.json() // Format logs as JSON
    ),
    transports: [
        // Log errors to error.log
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
        // Log all levels to combined.log
        new winston.transports.File({ filename: 'logs/combined.log', format: winston.format.combine(winston.format.timestamp(), winston.format.json()) })
    ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(), // Colorize the output
            winston.format.simple() // Simple format for console logs
        )
    }));
}

module.exports = logger;
