var model = require('./../../models/model'),
    orderModel = model.Order,
    provinceModel = model.Province,
    cityModel = model.City,
    userModel = model.User,
    msg = require("../../resource/msg"),
    then = require("thenjs"),
    excel = require('node-xlsx');

exports.commitExcel = function (req, res) {
    var creater = req.body.creater;
    var idBatch = req.body.idBatch;
    var type = req.body.type;
    var file = req.body.file.path;

    var orderLine = 0;
    var productLine = 0;

    var excelData;

    then(function(sequence){
        try{
            excelData = excel.parse(file);
            sequence(null, excelData);
        }catch(ex){
            sequence(new Error(msg.ORDER.orderExcelParseError));
        }
    }).then(function(sequence){
        var ordersData = excelData[0].data.slice(1);
        then.eachSeries(ordersData, function (next, orderData, index) {
            then(function(cont){
                var order = {
                    idBatch: idBatch,
                    type: 1,        //1-批量订单
                    kind: 1,        //已审核
                    creater: creater,
                    id: orderData[0],
                    name: orderData[1],
                    idGate: orderData[2],
                    chinaTransName: orderData[3],
                    chinaTransId: orderData[4],
                    manager: orderData[5],
                    sendName: orderData[6],
                    sendAddress: orderData[7],
                    sendPhone: orderData[8],
                    receiveName: orderData[9],
                    receiveProvince: "",
                    receiveProvinceName: orderData[10],
                    receiveCity: "",
                    receiveCityName: orderData[11],
                    receiveAddress: orderData[12],
                    receivePhone: orderData[13],
                    payerName: orderData[14],
                    payerAddress: orderData[15],
                    payerPhone: orderData[16],
                    payerIdType: orderData[17],
                    payerIdNo: orderData[18],
                    productName: orderData[19],
                    productNum: orderData[20],
                    productAmount: orderData[21],
                    productWeight: orderData[22],
                    transportAmount: orderData[23],
                    taxAmount: orderData[24],
                    safeAmount: orderData[25],
                    otherAmount: orderData[26],
                    isFixed: orderData[24],
                    isFast: orderData[25],
                    isProtected: orderData[26],
                    worldTransId: orderData[0],
                    worldTransName: msg.MAIN.companyName
                };
                cont(null, order);
            }).then(function(cont, order) {
                provinceModel.findOne({provinceName: order.receiveProvinceName || ""}).exec(function (err, doc) {
                    if (err) {
                        cont(err);
                        return;
                    }
                    if (doc) {
                        order.receiveProvince = doc.provinceId || "";
                    }
                    cont(err, order);
                });
            }).then(function (cont, order) {
                cityModel.findOne({cityName: order.receiveCityName || ""}).exec(function (err, doc) {
                    if (err) {
                        cont(err);
                        return;
                    }
                    if (doc) {
                        order.receiveCity = doc.cityId || "";
                    }
                    cont(err, order);
                });
            }).then(function (cont, order) {
                var model = new orderModel(order);
                model.save(function (err, doc) {
                    orderLine++;
                    if (err) {
                        err.type = 0;
                        err.message = "订单信息第[" + orderLine + "]行数据异常";
                    }
                    next(err, doc);
                });
            })
        }).then(function(next, doc){
            sequence(null, doc);
        }).fail(function(next, err){
            sequence(err)
        })
    }).then(function(sequence){
        var productsData = excelData[1].data.slice(1);
        then.eachSeries(productsData, function (next, each, index) {
            var product = {
                pName: each[1],
                pBrand: each[2],
                pNum: each[3],
                pUnit: each[4],
                pAmount: each[5],
                pTotalAmount: each[6],
                pWeight: each[7],
                pRemark: each[8]
            };
            orderModel.update({id: each[0]}, {'$addToSet': {products: product}}, function (err, doc) {
                productLine++;
                if (err) {
                    err.type = 1;
                    err.message = "产品信息第[" + productLine + "]行数据异常";
                }
                next(err, doc);
            });
        }).then(function(next, doc){
            sequence(null, doc);
        }).fail(function(next, err){
            sequence(err)
        })
    }).then(function (sequence, doc) {
        res.json("success");
    }).fail(function (sequence, err) {
        res.status(400).send(err.message);
    });
}

exports.processExcel = function (req, res) {
    var file = req.body.file.path;
    try{
        var data = excel.parse(file);
        res.json(data);
    }catch(ex){
        res.status(400).send("parse error");
    }
};

exports.commitBatch = function (req, res) {
    var ordersData = req.body.batchOrders;
    var productsData = req.body.batchProducts;
    var creater = req.body.creater;
    var idBatch = req.body.idBatch;
    var type = req.body.type;

    var orderLine = 0;
    var productLine = 0;

    then.eachSeries(ordersData, function(next, orderData, index) {
        then(function(cont) {
            var order = {
                idBatch: idBatch,
                type: 1,        //1-批量订单
                kind: 1,        //已审核
                creater: req.body.creater,
                id: orderData[0],
                name: orderData[1],
                idGate: orderData[2],
                chinaTransName: orderData[3],
                chinaTransId: orderData[4],
                manager: orderData[5],
                sendName: orderData[6],
                sendAddress: orderData[7],
                sendPhone: orderData[8],
                receiveName: orderData[9],
                receiveProvince: "",
                receiveProvinceName: orderData[10],
                receiveCity: "",
                receiveCityName: orderData[11],
                receiveAddress: orderData[12],
                receivePhone: orderData[13],
                payerName: orderData[14],
                payerAddress: orderData[15],
                payerPhone: orderData[16],
                payerIdType: orderData[17],
                payerIdNo: orderData[18],
                productName: orderData[19],
                productNum: orderData[20],
                productAmount: orderData[21],
                productWeight: orderData[22],
                transportAmount: orderData[23],
                taxAmount: orderData[24],
                safeAmount: orderData[25],
                otherAmount: orderData[26],
                isFixed: orderData[24],
                isFast: orderData[25],
                isProtected: orderData[26]
            };
            console.log(order);
            cont(null, order);
        }).then(function(cont, order){
            provinceModel.findOne({provinceName: order.receiveProvinceName||""}).exec(function (err, doc) {
                if (err) {
                    cont(err);
                    return;
                }
                if(doc){
                    order.receiveProvince = doc.provinceId||"";
                }
                cont(err, order);
            });
        }).then(function(cont, order){
            cityModel.findOne({cityName: order.receiveCityName||""}).exec(function (err, doc) {
                if (err) {
                    cont(err);
                    return;
                }
                if(doc){
                    order.receiveCity = doc.cityId||"";
                }
                cont(err, order);
            });
        }).then(function(cont, order){
            var model = new orderModel(order);
            model.save(function (err, doc) {
                orderLine++;
                if(err){
                    err.type = 0;
                    err.message = "订单信息第[" + orderLine + "]行数据异常";
                }
                next(err, doc);
            });
        })
    }).eachSeries(productsData, function(next, each, index) {
        var product = {
            pName: each[1],
            pBrand: each[2],
            pNum: each[3],
            pUnit: each[4],
            pAmount: each[5],
            pTotalAmount: each[6],
            pWeight: each[7],
            pRemark: each[8]
        };
        orderModel.update({id: each[0]}, {'$addToSet':{products:product}}, function (err, doc) {
            productLine++;
            if(err){
                err.type = 1;
                err.message = "产品信息第[" + productLine + "]行数据异常";
            }
            next(err, doc);
        });
    }).then(function(next, doc){
        res.json("success");
    }).fail(function(next, err) {
        res.status(400).send(err.message);
    });
};