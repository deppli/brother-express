var model = require("../../models/model"),
    customerModel = model.Customer,
    groupModel = model.Group,
    menuModel = model.Menu,
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
        console.log(customer);
        var password = req.body.password,
            loginId = req.body.loginId,
            loginTime = req.body.loginTime;
        if (password != tools.HmacSHA256(customer.password, loginId + ":" + loginTime)) {
            cont(new Error(msg.USER.userPasswd));
            return;
        }
        req.session.customer = customer;
        res.json({
            _id: customer._id,
            name: customer.name,
            position: customer.position,
            status: customer.status,
            role: customer.role
        });
    }).fail(function (cont, error) {
        res.status(400).send(error.message);
    });
};

exports.logout = function (req, res) {
    req.session.destroy();
    return res.json("success");
};