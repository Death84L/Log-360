const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');


const logConfig = {
    apis: {
        api1: { path: 'log1.log', level: 'info' },
        api2: { path: 'log2.log', level: 'info' },
    }
};

// Middleware to log API requests
router.use((req, res, next) => {
    const { method, originalUrl, body } = req;
    const timestamp = moment().toISOString();
    const logData = {
        id: uuidv4(),
        timestamp,
        method,
        originalUrl,
        body,
    };
    fs.appendFileSync('api_requests.log', JSON.stringify(logData) + '\n');
    next();
});

router.post('/log', (req, res) => {
    const { level, log_string, timestamp, source } = req.body;
    if (!level || !log_string || !timestamp || !source) {
        return res.status(400).json({ error: 'Invalid log format' });
    }
    if (level !== 'info' && level !== 'error' && level !== 'success') {
        return res.status(400).json({ error: 'Invalid log level' });
    }

    let apiConfig = logConfig.apis[source];
    if (!apiConfig) {
        const newLogPath = `${source}.log`;
        apiConfig = { path: newLogPath, level: level };
        logConfig.apis[source] = apiConfig;
    }

    const logData = {
        level,
        log_string,
        timestamp,
        metadata:{
            source
        }
    };

    fs.appendFileSync(apiConfig.path, JSON.stringify(logData) + '\n');
    res.status(200).json({ message: 'Log ingested successfully' });
});


module.exports = router;
