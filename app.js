const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(helmet.xssFilter());
app.use(helmet.frameguard());

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },
}));

app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
}));

app.set('trust proxy', 1);

app.set('view engine', 'html');

process.setMaxListeners(0);

// MODIFIED: Added the 'verify' function to capture the raw body
app.use(
    bodyParser.json({
        limit: '8mb',
        verify: (req, res, buf, encoding) => {
            if (buf && buf.length) {
                req.rawBody = buf.toString(encoding || 'utf8');
            }
        },
    })
);

// MODIFIED: Also added 'verify' here for urlencoded bodies
app.use(
    bodyParser.urlencoded({
        limit: '8mb',
        extended: true,
        verify: (req, res, buf, encoding) => {
            if (buf && buf.length) {
                req.rawBody = buf.toString(encoding || 'utf8');
            }
        },
    })
);

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

const routes = require('./routes');

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const ip = req.headers['x-real-ip'] || req.socket.remoteAddress || null;
    console.log('ip', ip);
    console.log('ApiFail', req.method, {
        url: req.originalUrl, body: req.body, ip, error: 'Not Found'
    });
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    console.log(err);
    console.log(`Error, URL NOT FOUND. Requested URL: ${ req.originalUrl }`);
    res.status(err.status || 500);
    res.json({ success: false, message: '404 - Not Found' });
});

module.exports = app;
