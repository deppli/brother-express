var model = require('./../../models/model'),
    orderModel = model.Order,
    provinceModel = model.Provinces,
    cityModel = model.Citys,
    areaModel = model.Areas,
    userModel = model.User,
    msg = require("../../resource/msg"),
    then = require("thenjs"),
    excel = require('node-xlsx');

//2015.08.05之前版本，后续批量模板更新
exports.commitExcel = function (req, res) {
    var creater = req.body.creater;
    var idBatch = req.body.idBatch;
    var type = req.body.type;
    var file = req.body.file.path;

    var orderLine = 0;
    var productLine = 0;

    var excelData;

    __logger.info("开始进行批量数据导入操作,批次号[" + idBatch + "]");
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
                    payStatus: 1,        //已审核
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
                    isFixed: orderData[27],
                    isFast: orderData[28],
                    isProtected: orderData[29],
                    worldTransId: orderData[0],
                    worldTransName: msg.MAIN.companyName,
                    description: orderData[30]||"",
                    products: []
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
        __logger.info("批量导入数据成功,批次号[" + idBatch + "]");
        res.json("success");
    }).fail(function (sequence, err) {
        __logger.error("批量导入数据失败,批次号[" + idBatch + "],错误信息[" + err.message + "]");
        res.status(400).send(err.message);
    });
}

exports.processExcel = function (req, res) {
    var file = req.body.file.path;
    try{
        var data = excel.parse(file);
        res.json(data);
    }catch(ex){
        __logger.error("处理Excel文件失败,错误信息[" + ex + "]");
        res.status(400).send("parse error");
    }
};


//该方法为更新后批量模板,精简了流程等要素
exports.batchImport = function (req, res) {
    var creater = req.body.creater;
    var idBatch = req.body.idBatch;
    var orders = req.body.orders;

    __logger.info("开始进行批量数据导入操作,批次号[" + idBatch + "]");
    then.eachSeries(orders, function (cont, each, index) {
        var orderId = each.id;
        orderModel.findOne({id: orderId}).exec(function(err, doc){
            if(doc){
                cont(new Error("第" + (index+1) + "行" + msg.ORDER.orderIdExist))
            }
            cont(err, doc);
        })
    }).eachSeries(orders, function (cont, each, index) {
        each.creater = creater;
        each.idBatch = idBatch;
        __logger.info(each);
        new orderModel(each).save(function(err, doc){
            cont(err, doc);
        })
    }).then(function (cont, doc) {
        __logger.info("批量导入数据成功,批次号[" + idBatch + "]");
        res.json("success");
    }).fail(function (cont, err) {
        __logger.error("批量导入数据失败,批次号[" + idBatch + "],错误信息[" + err.message + "]");
        res.status(400).send(err.message);
    });
}