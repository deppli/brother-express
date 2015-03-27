var model = require("../../models/model"),
    userModel = model.User,
    groupModel = model.Group,
    menuModel = model.Menu,
    msg = require("../../resource/msg"),
    tools = require("../../util/tools"),
    then = require("thenjs");

exports.login = function (req, res) {
    var user = {
        loginId: req.body.loginId,
        status: 1
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
        if (date - req.body.loginTime > 259200000) {
            cont(new Error(msg.MAIN.requestOutdate));
        }
        userModel.findOne(user).populate("group").exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            if (!doc) {
                cont(new Error(msg.USER.userNone));
                return;
            }else{
                groupModel.populate(doc.group, "menu", function(err, group){
                    menuModel.populate(group.menu, "subMenu", function(err, menu){
                        doc.group.menu = menu;
                        cont(null, doc);
                    })
                });
            }
        });
    }).then(function (cont, user) {
        var password = req.body.password,
            loginId = req.body.loginId,
            loginTime = req.body.loginTime;
        if (password != tools.HmacSHA256(user.password, loginId + ":" + loginTime)) {
            cont(new Error(msg.USER.userPasswd));
            return;
        }
        req.session.user = user;
        res.json({
            _id: user._id,
            loginId: user.loginId,
            name: user.name,
            group: user.group,
            position: user.position,
            status: user.status,
            role: user.role
        });
    }).fail(function (cont, error) {
        res.status(400).send(error.message);
    });
};

exports.logout = function (req, res) {
    req.session.destroy();
    return res.json("success");
};