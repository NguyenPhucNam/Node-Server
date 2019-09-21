const app = require("./app");
const mongoose = require("mongoose");
const config = require('./config/config');
const server = require("http").Server(app);

mongoose.Promise = global.Promise;
mongoose.connect(config.MongoDb, { useNewUrlParser: true })
.then(() => console.log("Start Database Success"))
.catch((err, done) => done("Could not connect to DB: " + err));

const port = config.Port || process.env.PORT;
server.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.log(err.stack);
        return;
    }

    console.log("Start server: " + port);
});