const compression = require("compression");
const express = require("express");
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const config = require('./config/config.json');
const bodyParser = require("body-parser");
const homeRouter = require("./routes/home");
const productsRouter = require("./routes/products");
const accountRouter = require("./routes/account");
const sellerRouter = require("./routes/seller");
const app = express();

app.use(compression())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.disable('x-powered-by');

// Allowed extensions list can be extended depending on your own needs
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.ico',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];

app.use(express.static(path.join(__dirname, 'dist'), { maxAge: '1 year' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1 year' }));

app.use((req, res, next) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        const stat = fs.statSync(`dist/${req.url}`);
        Promise.all([
            res.header("Access-Control-Allow-Origin", "*"),
            res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            ),
            res.header("Last-Modified", stat.mtime.toUTCString()),
            res.header("Content-Length", stat.size),
            res.header("Cache-Control", "public, s-maxage=31536000, max-age=31536000"),
            res.header("ETag", `Ozy7_${stat.mtime.getTime()}`),
            res.header("Cache-Control", "public, s-maxage=31536000, max-age=31536000"),
            res.header("Expires", new Date(Date.now() + 31536000).toUTCString()),
            res.header("Date", new Date().toUTCString())
        ]);
    }
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).send();
    }
    next();
});

mongoose.Promise = global.Promise;
mongoose.connect(config.MongoDb, { useNewUrlParser: true })
.then(() => console.log("Start Database Success"))
.catch((err, done) => done("Could not connect to DB: " + err));

app.use('/api', homeRouter);
app.use('/api/san-pham', productsRouter);
app.use('/api/tai-khoan', accountRouter);
app.use('/api/kenh-nguoi-ban', sellerRouter);

app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        console.log(req.url);
        res.sendFile(path.join(__dirname, `dist/${req.url}`));
    } else {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    }
});

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;