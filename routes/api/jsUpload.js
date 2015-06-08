/**
 author：
 张寰
 date:
 2015.02.16
 description:
 文件上传模块,采用frame方式支持异步上传，异步相关机制代码交由前端实现.
 version:
 1.0
 **/
var formidable = require('formidable'),
    util = require('util'),
    tools = require('../../util/tools'),
    excel = require('node-xlsx'),
    config = require("../../resource/config");

exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();

    form.uploadDir = config.basic.UPLOAD_PATH;
    form.keepExtensions = true;
    form.maxFieldsSize = 20 * 1024 * 1024;

    /*form.on('fileBegin', function(name, file) {
        var now = new Date().format("yyyyMMddhhmmssS");
        file.path = config.UPLOAD_PATH + now;
    });*/

    form.on('progress', function(bytesReceived, bytesExpected ,ending){
        if(bytesReceived > form.maxFieldsSize){
            req.socket.destroy();
        }
    });

    form.parse(req, function(err, fields, files) {
        if(!err){
            res.json(files);
        }
    });
}