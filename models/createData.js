var model = require("./model"),
    UserModel = model.User,
    TodoModel = model.Todo,
    TodoTypeModel = model.TodoType,
    GroupModel = model.Group,
    InterfaceModel = model.Interface,
    OrderModel = model.Order,
    MenuModel = model.Menu,
    ParamsModel = model.Params,
    then = require("thenjs");

/*var menuA0 = [
    {
        id:"A001",
        name: "分组管理",
        description: "",
        link: "#/group",
        role: "0",
        level: "1"
    },
    {
        id:"A002",
        name: "用户管理",
        description: "",
        link: "#/user",
        role: "0",
        level: "1"
    },
    {
        id:"A003",
        name: "新闻公告管理",
        description: "",
        link: "#/news",
        role: "0",
        level: "1"
    },
     {
         id:"A004",
         name: "系统参数维护",
         description: "",
         link: "#/settings",
         role: "0",
         level: "1"
     }
]
var menuA1 = [
    {
        id:"A101",
        name: "客户信息管理",
        description: "",
        link: "#/customer",
        role: "0",
        level: "1"
    }
]
var menuA2 = [
    {
        id:"A201",
        name: "订单管理",
        description: "",
        link: "#/order",
        role: "0",
        level: "1"
    },
    {
        id:"A202",
        name: "批量订单",
        description: "",
        link: "#/orderBatch",
        role: "0",
        level: "1"
    }
]
var rootMenu = [
    {
        id:"A000",
        name: "后台管理",
        description: "",
        role: "0",
        level: "0",
        subMenu: []
    },
    {
        id:"A100",
        name: "客户管理",
        description: "",
        role: "0",
        level: "0",
        subMenu: []
    },
    {
        id:"A200",
        name: "订单管理",
        description: "",
        role: "0",
        level: "0",
        subMenu: []
    }
]
var ids = [];
menuA0.forEach(function(each){
    new MenuModel(each).save(function(err, doc) {
        if(doc) {
            console.log(doc);
            if (!ids[0]) {
                ids[0] = [];
            }
            ids[0].push(doc._id);
        }
    });
})
menuA1.forEach(function(each){
    new MenuModel(each).save(function(err, doc) {
        if(doc){
            console.log(doc);
            if(!ids[1]){
                ids[1] = [];
            }
            ids[1].push(doc._id);
        }
    });
})
menuA2.forEach(function(each){
    new MenuModel(each).save(function(err, doc) {
        if(doc) {
            console.log(doc);
            if (!ids[2]) {
                ids[2] = [];
            }
            ids[2].push(doc._id);
        }
    });
})

setTimeout(function() {
    rootMenu.forEach(function(each, index){
        each.subMenu = ids[index];
        new MenuModel(each).save(function(err, doc) {
            console.log(doc);
        });
    });
}, 2000);*/
/*
MenuModel.findOne({id:"A004"}).exec(function(err,doc){
    var id = doc._id
    console.log(doc);
    MenuModel.update({id: "A000"}, {'$addToSet':{subMenu:doc._id}}, function (err, doc) {
        console.log(doc);
    })
});*/
//初始化省份城市列表
/*var fs = require('fs');
var model = require('./model');
var dbData = [];
var cityModel = model.City;
fs.readFile('g:/city', 'utf8', function (err, data) {
    if (err) throw err;
    var dataArr = data.split('\n');
    dataArr.forEach(function(each){
        var final = {};
        var oneArr = each.split('|');
        final.cityId = oneArr[0];
        final.cityName = oneArr[1];
        final.provinceId = oneArr[2];
        new cityModel(final).save(function(err, doc){
            console.log(doc);
        })
    });
});

var provinceData = [];
var provinceModel = model.Province;
fs.readFile('g:/province', 'utf8', function (err, data) {
    if (err) throw err;
    var dataArr = data.split('\n');
    dataArr.forEach(function(each){
        var final = {};
        var oneArr = each.split('|');
        final.provinceId = oneArr[0];
        final.provinceName = oneArr[1];
        new provinceModel(final).save(function(err, doc){
            console.log(doc);
        })
    });
});*/

var setting = {
    paramsId:"0A001",
    paramsName: "美元",
    paramsGroup: "0A",
    paramsGroupName: "汇率",
    paramsValue: "0.1605"
}
new ParamsModel(setting).save(function(err, doc) {
    console.log(doc)
});


