var model = require('./../../models/model'),
    provinceModel = model.Province,
    cityModel = model.City,
    menuModel = model.Menu,
    userModel = model.User,
    paramsModel = model.Params,
    orderModel = model.Order,
    async = require('async'),
    qs = require('querystring'),
    formidable = require('formidable'),
    excel = require('node-xlsx'),
    http = require('http'),
    msg = require("../../resource/msg"),
    config = require("../../resource/config")
    then = require("thenjs"),
    fs=require('fs');
    crypto = require('crypto');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.exmail.qq.com',
    port: 25,
    auth: {
        user: 'service@brother-express.com',
        pass: 'brother2015'
    }
}));

exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();

    var type = req.query.type;
    var fileName = req.query.file;
    form.uploadDir = config.UPLOAD_PATH;
    form.keepExtensions = true;
    form.maxFieldsSize = 20 * 1024 * 1024;

    form.on('progress', function(bytesReceived, bytesExpected ,ending){
        if(bytesReceived > form.maxFieldsSize){
            req.socket.destroy();
        }
    });

    form.parse(req, function(err, fields, files) {
        var newPath;
        if(fileName!=undefined){
            var readStream=fs.createReadStream(files.file.path);
            var writeStream;
            if(type==1){    //若为身份证上传
                newPath = config.UPLOAD_IDNO_PATH + fileName + ".jpg";
                writeStream=fs.createWriteStream(newPath);
            }else if(type==2){  //若为批量订单上传
                newPath = config.UPLOAD_PATH + fileName + ".xlsx";
                writeStream=fs.createWriteStream(newPath);
            }
            readStream.pipe(writeStream);
            readStream.on('end',function(){
                fs.unlinkSync(files.file.path);
                if(!err){
                    files.file.path = newPath;
                    res.json(files);
                }
            });
        }
    });
}

exports.listMenus = function (req, res) {
    menuModel.find({level: '0'}).populate('subMenu').exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.listProvinces = function (req, res) {
    var queryString = {};
    if(req.body.provinceId){
        queryString.provinceId = req.body.provinceId
    }
    provinceModel.find().exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.listCitys = function (req, res) {
    var queryString = {};
    if(req.body.provinceId){
        queryString.provinceId = req.body.provinceId
    }
    if(req.body.cityId){
        queryString.cityId = req.body.cityId
    }
    cityModel.find(queryString).exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.queryOrder = function (req, res) {
    var order = {id : req.body.id}

    //TODO 增加关联查询
    orderModel.findOne(order).exec(function(err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        if (!doc){
            res.status(400).send(msg.ORDER.orderIdNotExist);
            return;
        }
        res.json(doc);
    });
};

exports.queryOrderPath = function(req, res) {

    var data = {
        cno: req.body.orderId,   //610291500140161
        cp: "65001"
    };

    var content = qs.stringify(data);

    var options = {
        hostname: config.EXPRESS_API_HOST,
        port: config.EXPRESS_API_PORT,
        path: config.EXPRESS_API_PATH + content,
        method: config.EXPRESS_API_METHOD
    };

    var request = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            res.send(chunk);
        });
    });

    request.on('error', function (err) {
        res.status(400).json(msg.ORDER.orderPathSyncError);
        console.log('problem with request: ' + err.message);
    });

    request.end();
};

exports.listSettings = function(req, res) {
    var queryString = {};
    if(req.body.paramsGroup){
        queryString.paramsGroup = req.body.paramsGroup
    }

    paramsModel.find(queryString).exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
}

exports.getSettings = function(req, res) {
    var queryString = {};
    if(req.body.paramsId){
        queryString.paramsId = req.body.paramsId
    }

    paramsModel.findOne(queryString).exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
}

exports.updateSettings = function(req, res) {
    var settings = [];
    if(req.body.settings){
        settings = req.body.settings;
    }

    async.eachSeries(settings, function(param, callback) {
        var queryString = {paramsId: param.paramsId};
        var updateString = {
            paramsName: param.paramsName,
            paramsValue: param.paramsValue
        }
        paramsModel.update(queryString, updateString).exec(function (err, doc) {
            callback(err, doc);
        });
    },function(err, result){
        // if any of the file processing produced an error, err would equal that error
        if( err ) {
            res.status(400).send(error.message);
        }else{
            res.json("success")
        }
    });
}

//微信、外部渠道更新订单信息
exports.updateOrder = function(req, res) {
    var loginId = req.body.loginId;
    var orderId = req.body.orderId; //db id
    var status = req.body.status;

    then(function (cont) {
        if(!loginId){
            cont(new Error(msg.USER.loginIdErr));
            return;
        }
        userModel.findOne({loginId: loginId, status: 1}).exec(function(err, doc){
            if(err || !doc){
                cont(new Error(msg.USER.userNone));
                return;
            }
            cont(err, doc);
        });
    }).then(function(cont, user){
        orderModel.findByIdAndUpdate(orderId, {status:status}, null, function(err, doc){
            if (err) {
                cont(new Error(msg.ORDER.orderUpdateFail));
                return;
            }
            cont(err, user);
        })
    }).then(function(cont, user){
        var updater = {
            updater: loginId,
            gis: req.body.gis||"",
            gisText: req.body.gisText||"",
            status: status,
            remark: req.body.remark||""
        }

        orderModel.update({_id: orderId}, {'$addToSet':{updateInfo:updater}}, function (err, doc) {
            if (err) {
                cont(new Error(msg.ORDER.orderUpdateFail));
                return;
            }
            res.json("success");
        })
    }).fail(function (cont, error) {
        res.status(400).send(error.message);
    })
};

/*{
    from: 'zhanghuan@annlover.com',
        to: 'm13818239270@163.com',
    subject: 'hello',
    text: 'hello world!'
}*/
exports.sendMail = function(req, res){
    var toEmail = req.body.loginId;
    var token = Math.ceil(Math.random()*10000000);
    req.session.token = token;

    html = "<html><body><p>您好：</p> " +
    "<p>我们收到您在仲良速递的注册申请，请点击下面的链接激活帐户：</p>" +
    "<a href='" + config.SYSTEM_HOST + "/service/validateEmail?token=" + token + "'>" + "请点击本链接激活帐号</a></body></html>"

    var mail = {
        from: '仲良速递<service@brother-express.com>',
        to: toEmail,
        subject: '仲良速递注册验证',
        html: html
    }
    transporter.sendMail(mail, function(err, info){
        console.log(err);
        console.log(info);
    });
    res.json("success");
}

//校验邮箱验证
exports.validateEmail = function(req, res){
    var token = req.query.token;
    var sessionToken = req.session.token;
    res.status(302);
    if(token && sessionToken && token == sessionToken){
        req.session.token = null;
        req.session.emailCheck = true;
        res.setHeader("Location", "/email.html");
    }else{
        res.setHeader("Location", "/error.html");
    }
    res.end();
}

//检查邮箱验证状态
exports.checkValidateEmail = function(req, res){
    if(req.session.emailCheck){
        req.session.emailCheck = false;
        res.json("success");
    }else{
        res.status(400).send(msg.MAIN.validateEmail);
    }
}