var log4js = require("log4js"),
    path = require("path");
log4js.configure({
    appenders: [
        { type: "console" },
        { type: "file", filename: path.join(__dirname, "../logs/access.log"), category: "access" }
    ],
    replaceConsole: true
});

var level = process.env.NODE_ENV == "pro"? "ERROR": "INFO",
    logger = log4js.getLogger("access");
logger.setLevel(level);
exports.logger = logger;