const fs = require('fs');
const readline = require('readline');

function processLogs(callback) {
    // Define the path to your log file
    const logFilePath = './logs/combined.log';

    // Create a read stream for the log file
    const readStream = fs.createReadStream(logFilePath);

    // Create an interface to read the file line by line
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    let logArray = [];

    rl.on('line', (line) => {
        try {
            const logEntry = JSON.parse(line);
            if (logEntry.level === 'info') {
                logArray.push({ message: logEntry.message });
                console.log(logEntry.message);
            }
        } catch (error) {
            console.error('Error parsing log entry:', error);
        }
    });

    rl.on('close', () => {
        console.log('End of log file.');
        // console.log('logArray:', logArray);
        if (typeof callback === 'function') {
            callback(logArray);
        }
    });
}

module.exports = processLogs;
