var model = require('./../../models/model'),
    provinceModel = model.Province,
    cityModel = model.City,
    menuModel = model.Menu,
    userModel = model.User,
    customerModel = model.Customer,
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

exports.checkCustomer = function(req, res) {
    var customer = {
        loginId: req.body.loginId
    };

    customerModel.findOne(customer).exec(function(err, doc) {
        if (err) {
            __logger.error("用户校验失败[" + err.message + "]")
            res.status(400).send(err.message);
            return;
        }
        if (doc) {
            res.status(400).send(msg.USER.loginIdExist);
            return;
        }
        res.json("success");
    });
}

exports.addCustomer = function(req, res) {
    then(function (cont) {
        var customer = {
            loginId: req.body.loginId
        };
        __logger.info("又一个土豪来注册了,注册邮箱[" + customer.loginId + "]")

        customerModel.findOne(customer).exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            if (doc) {
                cont(new Error(msg.USER.loginIdExist));
                return;
            }
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        paramsModel.findOne({paramsId:'0B001'}).exec(function (err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            cont(null, doc);
        });
    }).then(function(cont, doc){
        var customer = new customerModel({
            loginId: req.body.loginId,
            nickname: req.body.nickname,
            name: req.body.name,
            password: req.body.password,
            img: req.body.img,
            idNoImgA: req.body.idNoImgA,
            idNoImgB: req.body.idNoImgB,
            sex: req.body.sex,
            idNo: req.body.idNo,
            birthday: req.body.birthday,
            zipCode: req.body.zipCode||"",
            phone: req.body.phone,
            address: req.body.address,
            status: req.body.status||1,
            balance: doc.paramsValue||0
        });

        customer.save(function (err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        customerModel.findOne(doc).exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            __logger.info("土豪注册成功了,撒花欢迎[" + doc.loginId + "]")
            res.json(doc);
        });
    }).fail(function (cont, error) {
        __logger.error("又一个土豪[" + req.body.loginId + "]注册失败了[" + error.message + "]")
        res.status(400).send(error.message);
    });

};

exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();

    var type = req.query.type;
    var fileName = req.query.file;
    form.uploadDir = config.basic.UPLOAD_PATH;
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
            if(type==1){    //若为身份证上传
                newPath = config.basic.UPLOAD_IDNO_PATH + fileName + ".jpg";
            }else if(type==2){  //若为批量订单上传
                newPath = config.basic.UPLOAD_PATH + fileName + ".xlsx";
            }
            fs.rename(files.file.path, newPath, function(err){
                if(!err){
                    files.file.path = newPath;
                    __logger.info("文件上传成功:" + newPath);
                    res.json(files);
                }else{
                    __logger.error("文件上传失败:" + err);
                    res.status(400).send(err.message);
                }
            });
        }
    });
}

exports.listMenus = function (req, res) {
    menuModel.find({level: '0'}).populate('subMenu').exec(function (err, doc) {
        if (err) {
            __logger.error("我去,拉个菜单列表都能失败，不想活了[" + err.message + "]")
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
            __logger.error("我去,拉个省份列表都能失败，你TM逗我呢[" + err.message + "]")
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
            __logger.error("我去,拉个城市列表都能失败，你TM逗我呢[" + err.message + "]")
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.queryOrder = function (req, res) {
    var order = {id : req.body.id}
    var random = Math.floor(Math.random() * 1000)
    __logger.info("某个土豪(" + random + ")又开始查询订单啦，订单编号[" + order.id + "]")

    //TODO 增加关联查询
    orderModel.findOne(order).exec(function(err, doc) {
        if (err) {
            __logger.error("这丫的(" + random + ")订单查询失败[" + err.message + "]")
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

exports.thirdPath = function(req, res) {

    var data = {
        cno: req.body.orderId,   //610291500140161
        cp: "65001"
    };

    var content = qs.stringify(data);

    var options = {
        hostname: config.basic.EXPRESS_API_HOST,
        port: config.basic.EXPRESS_API_PORT,
        path: config.basic.EXPRESS_API_PATH + content,
        method: config.basic.EXPRESS_API_METHOD
    };

    var body = "";

    var request = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body+=chunk;
        }).on('end', function(){
            res.send(body);
        });
    }).on('error', function (err) {
        __logger.error("注意啦!清关接口又调用失败啦,什么破系统[" + err.message + "]")
        res.status(400).json(msg.ORDER.orderPathSyncError);
    })

    request.end();
};

/**
 * 全轨迹查询，包括第三方清关轨迹
 * @param req
 * @param res
 */
exports.fullPath = function(req, res) {

    var order = {id : req.body.id}

    then(function(cont){
        //TODO 增加关联查询
        orderModel.findOne(order, {updateInfo: 1}).exec(function(err, doc) {
            if (!doc){
                cont(new Error(msg.ORDER.orderIdNotExist));
            }else{
                cont(err, doc.updateInfo);
            }
        })
    }).then(function(cont, globalPath){
        var data = {
            cno: req.body.id,   //610291500140161
            cp: "65001"
        };

        var content = qs.stringify(data);

        var options = {
            hostname: config.basic.EXPRESS_API_HOST,
            port: config.basic.EXPRESS_API_PORT,
            path: config.basic.EXPRESS_API_PATH + content,
            method: config.basic.EXPRESS_API_METHOD
        };

        var body = "";
        var request = http.request(options, function (response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                body+=chunk;
            }).on('end', function(){
                var data = JSON.parse(body)
                var localPath = [];
                if(data.trackingEventList){
                    data.trackingEventList.forEach(function(each){
                        var node = {};
                        node.time = each.date;
                        node.gisText = each.place;
                        node.status = "";
                        node.remark = each.details;
                        localPath.push(node);
                    })
                }
                var path = globalPath.concat(localPath);
                cont(null, path)
            });
        }).on('error', function (err) {
            __logger.error("注意啦!清关接口又调用失败啦,什么破系统[" + err.message + "]")
            cont(new Error(msg.ORDER.orderPathSyncError));
        })
        request.end();
    }).then(function(cont, path){
        res.send(path);
    }).fail(function (cont, error) {
        res.status(400).send(error);
    });
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

    var random = Math.floor(Math.random() * 1000)
    __logger.info("某个高层人员(" + random + ")开始更新参数配置")
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
            __logger.error("某个高层人员(" + random + ")更新参数配置失败了[" + err.message + "]")
            res.status(400).send(err.message);
        }else{
            res.json("success")
        }
    });
}

//游客新建订单
exports.createOrder = function (req, res) {
    var random = Math.floor(Math.random() * 1000)
    then(function (cont) {
        var order = {
            id: req.body.id
        };
        __logger.info("某个注册都懒得做的家伙(" + random + ")开始下单了,订单编号[" + order.id + "]")

        orderModel.findOne(order).exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            if (doc) {
                cont(new Error(msg.ORDER.orderIdExist));
                return;
            }
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        var order = new orderModel({
            id: req.body.id,
            type: 3,                //游客订单
            payStatus: 0,                //未支付
            amount: req.body.amount,
            name: req.body.name,
            creater: req.body.creater,
            gateMode: req.body.gateMode || 0,
            idNoImgA: req.body.idAUrl || "",
            idNoImgB: req.body.idBUrl || "",
            worldTransId:  req.body.worldTransId,
            worldTransName:  req.body.worldTransName,
            chinaTransId:  req.body.chinaTransId,
            chinaTransName:  req.body.chinaTransName,
            payerName: req.body.payerName,
            payerPhone: req.body.payerPhone,
            payerIdType: req.body.payerIdType,
            payerIdNo: req.body.payerIdNo,
            payerAddress: req.body.payerAddress,
            payerZipCode: req.body.payerZipCode,
            sendName: req.body.sendName,
            sendAddress: req.body.sendAddress,
            sendPhone: req.body.sendPhone,
            receiveName: req.body.receiveName,
            receiveProvince: req.body.receiveProvince,
            receiveProvinceName: req.body.receiveProvinceName||"",
            receiveCity: req.body.receiveCity,
            receiveCityName: req.body.receiveCityName,
            receiveAddress: req.body.receiveAddress,
            receivePhone: req.body.receivePhone,
            receiveZipCode: req.body.receiveZipCode,
            productName: req.body.productName,
            productNum: req.body.productNum,
            productAmount: req.body.productAmount,
            productWeight: req.body.productWeight,
            products: req.body.products,
            transportAmount: req.body.transportAmount,
            taxAmount: req.body.taxAmount,
            safeAmount: req.body.safeAmount,
            otherAmount: req.body.otherAmount,
            isFixed: req.body.isFixed||0,
            isFast: req.body.isFast||0,
            isProtected: req.body.isProtected||0,
            flagBox: req.body.flagBox||0,
            flagDetailProduct: req.body.flagDetailProduct||0,
            flagElec: req.body.flagElec||0,
            flagRemovePages: req.body.flagRemovePages||0,
            flagReturnProduct: req.body.flagReturnProduct||0,
            flagStore: req.body.flagStore||0
        });

        order.save(function (err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        __logger.info("某个注册都懒得做的家伙(" + random + ")下单成功")
        res.json("success");
    }).fail(function (cont, error) {
        __logger.error("某个注册都懒得做的家伙(" + random + ")果然下单失败了[" + error.message + "]")
        res.status(400).send(error.message);
    });

};

//上传证件照
exports.updateOrderIdno = function(req, res) {
    var _id = req.body.id;
    var orderId = req.body.orderId;
    var idA = req.body.idAUrl;
    var idB = req.body.idBUrl;

    __logger.info("(" + orderId + ")订单的主人/非主人正在更新证件照")

    then(function (cont) {
        orderModel.findByIdAndUpdate(_id, {idNoImgA:idA, idNoImgB:idB}, null, function(err, doc){
            if (err) {
                cont(new Error(msg.ORDER.orderUpdateFail));
                return;
            }
            __logger.info("(" + orderId + ")订单更新证件照成功")
            res.json("success");
        })
    }).fail(function (cont, error) {
        __logger.error("(" + orderId + ")订单更新证件照失败,错误信息[" + error.message + "]")
        res.status(400).send(error.message);
    })
};

//微信、外部渠道更新订单信息
exports.updateOrder = function(req, res) {
    var loginId = req.body.loginId;
    var orderId = req.body.orderId; //db id
    var status = req.body.status;

    __logger.info("咱们的人(" + loginId + ")开始更新订单信息,订单编号[" + orderId + "]")

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
            __logger.info("咱们的人(" + loginId + ")更新订单信息成功,订单编号[" + orderId + "]")
            res.json("success");
        })
    }).fail(function (cont, error) {
        __logger.error("咱们的人(" + loginId + ")更新订单信息失败,订单编号[" + orderId + "],错误信息[" + error.message + "]")
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
    "<a href='" + config.basic.SYSTEM_HOST + "/service/validateEmail?token=" + token + "'>" + "请点击本链接激活帐号</a></body></html>"

    var mail = {
        from: '仲良速递<service@brother-express.com>',
        to: toEmail,
        subject: '仲良速递注册验证',
        html: html
    }
    transporter.sendMail(mail, function(err, info){
        if(err){
            __logger.error("账号注册邮件(" + toEmail +")发送失败：" + err.message)
            res.status(400).send(err.message);
        }else{
            __logger.info("账号注册邮件(" + toEmail +")发送成功")
    res.json("success");
}
    });
    //res.json("success");
}

//校验邮箱验证
exports.validateEmail = function(req, res){
    var token = req.query.token;
    var sessionToken = req.session.token;
    res.status(302);
    if(token && sessionToken && token == sessionToken){
        req.session.token = null;
        req.session.emailCheck = true;
        __logger.info("邮箱校验成功(" + token + ")")
        res.setHeader("Location", "/email.html");
    }else{
        __logger.error("邮箱校验失败(" + token + ")")
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


exports.forgetPassword = function(req, res){
    var toEmail = req.body.loginId;

    var customer = {
        loginId: toEmail
    };

    customerModel.findOne(customer).exec(function(err, doc) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (!doc) {
            res.status(400).send(msg.USER.loginIdNone);
            return;
        }else{
            var token = Math.ceil(Math.random()*10000000);
            req.session.token = token;
            req.session.loginId = toEmail;

            html = "<html><body><p>您好：</p> " +
            "<p>我们收到您在仲良速递的密码重置申请，请于10分钟内点击下面的链接完成密码重置操作：</p>" +
            "<a href='" + config.basic.SYSTEM_HOST + "/resetPwd.html?loginId=" + toEmail + "&token=" + token + "'>" + "请点击本链接进行密码重置</a></body></html>"

            var mail = {
                from: '仲良速递<service@brother-express.com>',
                to: toEmail,
                subject: '仲良速递账户密码重置',
                html: html
            }
            transporter.sendMail(mail, function(err, info){
                if(err){
                    __logger.error("密码重置邮件(" + toEmail +")发送失败：" + err.message)
                    res.status(400).send(err);
                }else{
                    __logger.info("密码重置邮件(" + toEmail +")发送成功")
                    res.json("success");
                }
            });
        }
    });

}

//密码重置
exports.resetPassword = function(req, res){
    var token = req.body.token;
    var loginId = req.session.loginId;
    var password = req.body.password;
    var sessionToken = req.session.token;
    if(token && sessionToken && token == sessionToken && loginId){
        req.session.token = null;
        req.session.loginId = null;
        customerModel.findOneAndUpdate({loginId: loginId}, {password: password}, function (err, doc) {
            if (err) {
                __logger.error("密码重置(" + loginId +")失败：" + err.message)
                res.status(400).send(err.message);
                return;
            }
            __logger.error("密码重置(" + loginId +")成功")
            res.json("success");
        });
    }else{
        __logger.error("密码重置(" + loginId +")失败")
        res.status(400).send("error");
    }
}

//查询订单支付状态
exports.queryPayStatus = function (req, res) {
    orderModel.findOne({id: req.body.orderId}).exec(function(err, doc) {
        if (err) {
            __logger.info("订单(" + req.body.orderId + ")状态获取失败:" + err);
            res.status(400).send(err);
            return;
        }
        if (!doc) {
            __logger.info("查询订单状态,订单(" + req.body.orderId + ")不存在");
            res.status(400).send(msg.USER.userNone);
            return;
        }
        return res.json({payStatus: doc.payStatus});
    });
};