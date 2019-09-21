const app = require("./app");
const parseArgs = require('minimist');
const mongoose = require("mongoose");
const config = require('./config/config');
const server = require("http").Server(app);

mongoose.Promise = global.Promise;
mongoose.connect(config.MongoDb, { useNewUrlParser: true })
.then(() => console.log("Start Database Success"))
.catch((err, done) => done("Could not connect to DB: " + err));

const args = parseArgs(process.argv.slice(2));
const { name = 'default', port = '80'} = args;

server.listen(+port, '0.0.0.0', (err) => {
    if (err) {
      console.log(err.stack);
      return;
    }
  
    console.log(`Node [${name}] listens on http://127.0.0.1:${port}.`);
});