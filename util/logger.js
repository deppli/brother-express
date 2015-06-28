var log4js = require("log4js"),
    path = require("path");
log4js.configure({
    appenders: [
        { type: "console" },
        { type: "file", filename: path.join(__dirname, "../logs/access.log"), category: "log" }
    ],
    replaceConsole: true
});

var level = "INFO",
    logger = log4js.getLogger("log");
logger.setLevel(level);
exports.logger = logger;
global.__logger = logger;