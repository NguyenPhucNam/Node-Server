const app = require("./app");
const config = require('./config/config');
const server = require("http").Server(app);

const port = config.Port || process.env.PORT;
server.listen(port, '127.0.0.1', (err) => {
    if (err) {
        console.log(err.stack);
        return;
    }

    console.log("Start server: " + port);
});