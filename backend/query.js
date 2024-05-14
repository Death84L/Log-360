const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');

router.get('/search', (req, res) => {
    const { level, log_string, startTimestamp, endTimestamp, source, api_request } = req.query;

    let logFilePath;
    if (api_request) {
        logFilePath = `${api_request}.log`;
    } else {
        logFilePath = 'api_requests.log';
    }
    fs.readFile('api_requests.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read logs' });
        }

        let logs = data.split('\n').filter(log => {
            if (!log) return false; // Skip empty lines
            const logData = JSON.parse(log);
            // Apply filters
            if (level && logData.body.level !== level) return false;            
            if (log_string && !logData.body.log_string.includes(log_string))    return false;
            if (startTimestamp && moment(logData.body.timestamp).isBefore(startTimestamp)) return false;
            if (endTimestamp && moment(logData.body.timestamp).isAfter(endTimestamp)) return false;
            if (source && logData.body.metadata && logData.body.metadata.source !== source) return false;

            return true;
        }).map(log => JSON.parse(log));

        res.json({ logs });
    });
});

module.exports = router;
