var model = require('../../models/model'),
    customerModel = model.Customer,
    msg = require("../../resource/msg"),
    then = require("thenjs");

exports.check = function(req, res) {
    var customer = {
        loginId: req.body.loginId
    };

    customerModel.findOne(customer).exec(function(err, doc) {
        if (err) {
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

exports.add = function(req, res) {
    then(function (cont) {
        var customer = {
            loginId: req.body.loginId
        };

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
            phone: req.body.phone,
            address: req.body.address,
            status: req.body.status||1
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
            res.json(doc);
        });
    }).fail(function (cont, error) {
        res.status(400).send(error.message);
    });

};

exports.list = function (req, res) {
    customerModel.find().exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });

};

exports.detail = function (req, res) {
    customerModel.findById(req.body.id).exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.edit = function (req, res) {
    var customer = {
        nickname: req.body.nickname,
        name: req.body.name,
        //password: req.body.password,
        //img: req.body.img,
        sex: req.body.sex,
        idNo: req.body.idNo,
        birthday: req.body.birthday,
        phone: req.body.phone,
        address: req.body.address,
        //status: req.body.status,
        group: req.body.group
    };
    if(req.body.password){
        customer.password = req.body.password;
    }
    customerModel.findByIdAndUpdate(req.body.id, customer, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};

exports.delete = function (req, res) {
    customerModel.findByIdAndRemove(req.body.id, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};

exports.lock = function(req, res) {
    var customer = {
        status: 2
    }

    customerModel.findByIdAndUpdate(req.body.id, customer, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
}

exports.unlock = function (req, res) {
    var customer = {
        status: 1
    }

    customerModel.findByIdAndUpdate(req.body.id, customer, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};