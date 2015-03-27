//mongodb数据库连接
var mongoose = require('mongoose'),
    uri = 'mongodb://localhost/logistics',
    conn = exports.mongoConn = mongoose.createConnection(uri),
    logger = require("./util/logger").logger;

    conn.on('error', function(e) {
        logger.error("mongodb连接错误:" + e.message)
    });