var model = require('./../../models/model'),
    orderModel = model.Order,
    userModel = model.User,
    msg = require("../../resource/msg"),
    then = require("thenjs");
var http = require('http');
var qs = require('querystring');

exports.add = function (req, res) {
    var orderId = req.body.id
    then(function (cont) {
        var order = {
            id: req.body.id
        };
        __logger.info("开始新建订单,订单编号[" + orderId + "]");

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
            type: 0,                //基本订单
            payStatus: 1,                //已支付
            amount: req.body.amount,
            name: req.body.name,
            description: req.body.description,
            creater: req.body.creater,
            gateMode: req.body.gateMode || 0,
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
        __logger.info("新建订单[" + orderId + "]成功");
        res.json("success");
    }).fail(function (cont, error) {
        __logger.error("新建订单[" + orderId + "]失败[" + error.message + "]");
        res.status(400).send(error.message);
    });

};

exports.count = function (req, res) {
    var queryStr = {};
    var time = {};
    if(req.body.id){
        queryStr.id = req.body.id;
    }
    if(req.body.type){
        queryStr.type = req.body.type;
    }
    if(req.body.status){
        queryStr.status = req.body.status;
    }
    if(req.body.payStatus){
        queryStr.payStatus = req.body.payStatus;
    }
    if(req.body.time){
        var now = new Date();
        var begin = new Date();
        begin.setDate(begin.getDate()  - req.body.time);
        time = {"$and":[{"createTime":{"$gt": begin}},{"createTime":{"$lt": now}}]};
    }

    orderModel.find(time).find(queryStr).count(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.list = function (req, res) {
    var currentPage = req.body.currentPage;
    var pageSize = req.body.pageSize;
    var skipSize = (currentPage-1)*pageSize;

    var queryStr = {};
    var time = {};
    if(req.body.idBatch){
        queryStr.idBatch = req.body.idBatch;
    }
    if(req.body.id){
        queryStr.id = req.body.id;
    }
    if(req.body.type){
        queryStr.type = req.body.type;
    }
    if(req.body.payStatus){
        queryStr.payStatus = req.body.payStatus;
    }
    if(req.body.status){
        queryStr.status = req.body.status;
    }
    if(req.body.time){
        var now = new Date();
        var begin = new Date();
        begin.setDate(begin.getDate()  - req.body.time);
        time = {"$and":[{"createTime":{"$gt": begin}},{"createTime":{"$lt": now}}]};
    }
    if(req.body.gateMode){
        queryStr.gateMode = req.body.gateMode;
    }

    orderModel.find(time).find(queryStr).skip(skipSize).limit(pageSize).sort({createTime: -1}).exec(function(err, doc){
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.batchDelete = function (req, res) {
    var queryStr = {};
    var time = {};
    if(req.body.idBatch){
        queryStr.idBatch = req.body.idBatch;
    }
    if(req.body.id){
        queryStr.id = req.body.id;
    }
    if(req.body.type){
        queryStr.type = req.body.type;
    }
    if(req.body.status){
        queryStr.status = req.body.status;
    }
    if(req.body.time){
        var now = new Date();
        var begin = new Date();
        begin.setDate(begin.getDate()  - req.body.time);
        time = {"$and":[{"createTime":{"$gt": begin}},{"createTime":{"$lt": now}}]};
    }
    if(req.body.gateMode){
        queryStr.gateMode = req.body.gateMode;
    }

    orderModel.find(time).find(queryStr).remove({}, function(err, doc){
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.detail = function (req, res) {
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

exports.edit = function (req, res) {
    var update = {
        idBatch: req.body.idBatch,
        idGate: req.body.idGate,
        gateMode: req.body.gateMode,
        amount: req.body.amount,
        name: req.body.name,
        description: req.body.description,
        createTime: req.body.createTime,
        status:  req.body.status,
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
        receiveProvince: req.body.receiveProvince||"",
        receiveProvinceName: req.body.receiveProvinceName||"",
        receiveCity: req.body.receiveCity||"",
        receiveCityName: req.body.receiveCityName||"",
        receiveAddress: req.body.receiveAddress,
        receivePhone: req.body.receivePhone,
        receiveZipCode: req.body.receiveZipCode||"",
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
    };
    orderModel.findByIdAndUpdate(req.body.dbId, update, undefined, function (err, doc) {
        if (err) {
            __logger.error("修改订单[" + req.body.dbId + "]失败,错误信息[" + err.message + "]");
            res.status(400).send(err.message);
            return;
        }
        __logger.info("修改订单[" + req.body.dbId + "]成功");
        res.json("success");
    });
};

exports.pathUpdate = function (req, res) {
    var idBatch = req.body.idBatch;
    var update = {
        status:  req.body.status,
        updateInfo: req.body.updateInfo
    };
    if(idBatch){
        orderModel.update({idBatch:idBatch}, update, {safe: false, multi: true}, function (err, doc) {
            if (err) {
                __logger.error("批量轨迹更新[" + idBatch + "]失败[" + err.message + "]");
                res.status(400).send(err.message);
                return;
            }
            __logger.info("批量轨迹更新[" + idBatch + "]成功");
            res.json("success");
        });
    }else{
    orderModel.findByIdAndUpdate(req.body.dbId, update, undefined, function (err, doc) {
        if (err) {
                __logger.error("轨迹更新[" + req.body.dbId + "]失败[" + err.message + "]");
            res.status(400).send(err.message);
            return;
        }
            __logger.info("轨迹更新[" + req.body.dbId + "]成功");
        res.json("success");
    });
    }
};

exports.delete = function (req, res) {
    orderModel.findByIdAndRemove(req.body.id, undefined, function (err, doc) {
        if (err) {
            __logger.error("删除订单[" + req.body.id + "]失败[" + err.message + "]");
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};