var model = require("../../models/model"),
    customerModel = model.Customer,
    orderModel = model.Order,
    msg = require("../../resource/msg"),
    tools = require("../../util/tools"),
    then = require("thenjs");

exports.login = function (req, res) {
    var customer = {
        loginId: req.body.loginId
    };

    var menus = [];
    then(function (cont) {
        var date = Date.now();
        if (!req.body.loginId) {
            cont(new Error(msg.USER.loginIdErr));
            return;
        }
        if (!req.body.password) {
            cont(new Error(msg.USER.userPasswd));
            return;
        }
        if (date - req.body.password > 259200000) {
            cont(new Error(msg.MAIN.requestOutdate));
        }
        customerModel.findOne(customer).exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            if (!doc) {
                cont(new Error(msg.USER.userNone));
                return;
            }
            cont(null, doc);
        });
    }).then(function (cont, customer) {
        var password = req.body.password,
            loginId = req.body.loginId,
            loginTime = req.body.loginTime;
        if (password != tools.HmacSHA256(customer.password, loginId + ":" + loginTime)) {
            cont(new Error(msg.USER.userPasswd));
            return;
        }
        req.session.customer = customer;
        req.session.orders = {};
        res.json(customer);
    }).fail(function (cont, error) {
        __logger.error("用户(" + req.body.loginId + ")登录失败:" + error.message);
        res.status(400).send(error.message);
    });
};

exports.logout = function (req, res) {
    req.session.destroy();
    return res.json("success");
};

//会员新建订单
exports.createOrder = function (req, res) {
    then(function (cont) {
        var order = {
            id: req.body.id
        };

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
            type: 2,                //会员订单
            payStatus: 0,                //未支付
            amount: req.body.amount,
            name: req.body.name,
            creater: req.session.customer.loginId,
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
            receiveCity: req.body.receiveCity||"",
            receiveCityName: req.body.receiveCityName||"",
            receiveArea: req.body.receiveArea||"",
            receiveAreaName: req.body.receiveAreaName||"",
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
                __logger.error("用户(" + req.session.customer.loginId + ")订单创建失败:" + err);
                cont(new Error(err));
                return;
            }
            __logger.info("用户(" + req.session.customer.loginId + ")订单创建成功，订单号:" + req.body.id);
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        res.json("success");
    }).fail(function (cont, error) {
        res.status(400).send(error.message);
    });

};

exports.queryCustomer = function (req, res) {
    customerModel.findById(req.session.customer._id).exec(function(err, doc) {
        if (err) {
            __logger.error("用户(" + req.session.customer.loginId + ")信息查询失败:" + err);
            res.status(400).send(err);
            return;
        }
        if (!doc) {
            res.status(400).send(msg.USER.userNone);
            return;
        }
        return res.json(doc);
    });
};

exports.queryBalance = function (req, res) {
    customerModel.findById(req.session.customer._id).exec(function(err, doc) {
        if (err) {
            __logger.error("用户(" + req.session.customer.loginId + ")余额查询失败:" + err);
            res.status(400).send(err);
            return;
        }
        if (!doc) {
            res.status(400).send(msg.USER.userNone);
            return;
        }
        return res.json({balance: doc.balance});
    });
};

exports.listOrder = function (req, res) {
    orderModel.find({creater: req.session.customer.loginId, type: '2'}).exec(function(err, doc) {
        if (err) {
            __logger.error("用户(" + req.session.customer.loginId + ")订单列表查询失败:" + err);
            res.status(400).send(err);
            return;
        }
        return res.json(doc);
    });
};

exports.payOrder = function (req, res) {

    __logger.info("用户(" + req.session.customer.loginId + ")开始使用余额支付订单,订单号:" + req.body.orderId);
    customerModel.findById(req.session.customer._id).exec(function(err, doc) {
        if(doc){
            var balance = doc.balance;
            var cost = req.body.payAmount;
            if(balance - cost < 0 ){
                __logger.error("用户(" + req.session.customer.loginId + ")余额不足,订单号:" + req.body.orderId + "支付失败");
                res.status(400).send(msg.MAIN.balanceNotEnough);
                return;
            }else{
                customerModel.findByIdAndUpdate(doc._id, {balance: balance - cost}, null, function(err, doc){
                    orderModel.findOneAndUpdate({id: req.body.orderId}, {payStatus : 1}, null, function(err, doc){
                        if(err){
                            __logger.error("用户(" + req.session.customer.loginId + "),订单号:" + req.body.orderId + "支付失败:" + err);
                            return;
                        }
                        __logger.info("用户(" + req.session.customer.loginId + "),订单号:" + req.body.orderId + "支付成功");
                        return res.json("success");
                    })
                });
            }
        }else{
            __logger.error("用户(" + req.session.customer.loginId + ")登录状态失效,订单号:" + req.body.orderId + "支付失败");
            res.status(400).send(msg.USER.userNone);
            return;
        }
    })
};

//查询充值订单状态
exports.queryBanlancePayStatus = function (req, res) {
    var orderId = req.body.orderId;
    if(req.session.orders[orderId]){
        return res.json({payStatus: 1, amount: req.session.orders[orderId]});
    }else{
        return res.json({payStatus: 0, amount: 0});
    }
};