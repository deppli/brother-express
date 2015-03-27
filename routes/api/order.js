var model = require('./../../models/model'),
    orderModel = model.Order,
    userModel = model.User,
    msg = require("../../resource/msg"),
    then = require("thenjs");
var http = require('http');
var qs = require('querystring');

exports.add = function (req, res) {
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
            type: 0,                //基本订单
            kind: 1,                //已审核
            amount: req.body.amount,
            name: req.body.name,
            description: req.body.description,
            creater: req.body.creater,
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
            isProtected: req.body.isProtected||0
        });

        order.save(function (err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        res.json("success");
    }).fail(function (cont, error) {
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

    orderModel.find(time).find(queryStr).skip(skipSize).limit(pageSize).exec(function(err, doc){
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
        idGate: req.body.idGate,
        amount: req.body.amount,
        name: req.body.name,
        description: req.body.description,
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
        isProtected: req.body.isProtected||0
    };
    orderModel.findByIdAndUpdate(req.body.dbId, update, undefined, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};

exports.processUpdate = function (req, res) {

};

exports.delete = function (req, res) {
    orderModel.findByIdAndRemove(req.body.id, undefined, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};