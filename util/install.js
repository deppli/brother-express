//系统初始化
var then = require("thenjs"),
    tools = require("../util/tools"),
    model = require("../models/model"),
    userModel = model.User,
    groupModel = model.Group;

module.exports = function () {
    return then(function (cont) {
        new groupModel({
            id: "0001",
            type: 0,
            name: "管理组"
        }).save(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            cont(null, doc);
        })
    }).then(function (cont, group) {
        var password = tools.SHA256("zhanghuan"); // 超级管理员的初始密码，请自行修改
        password = tools.HmacSHA256(password, "logistics_server");

        new userModel({
            loginId: "zhanghuan",
            name: "张寰",
            password: password,
            img: "",
            sex: "男",
            idNo: "310107198911073913",
            birthday: "1987/02/19",
            phone: "13818239270",
            email: "m13818239270@163.com",
            address: "上海市嘉定区汇旺东路1188号",
            status: 1,
            group: group._id,
            role: 9
        }).save(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            cont(null, doc);
        });
    });
};
