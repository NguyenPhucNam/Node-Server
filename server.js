const app = require("./app");
const config = require('./config/config');
const server = require("http").Server(app);

const port = process.env.PORT || config.Port;
server.listen(port, '0.0.0.0', () => {
    console.log("Start server: " + port);
});