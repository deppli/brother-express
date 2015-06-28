var model = require('../../models/model'),
    userModel = model.User,
    groupModel = model.Group,
    msg = require("../../resource/msg"),
    then = require("thenjs");

exports.add = function(req, res) {
    then(function (cont) {
        var user = {
            loginId: req.body.loginId
        };

        userModel.findOne(user).exec(function(err, doc) {
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
    }).then(function(cont) {
        groupModel.findById(req.body.group).exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            if (!doc) {
                cont(new Error(msg.GROUP.groupNone));
                return;
            }

            cont(null, doc);
        });
    }).then(function(cont, doc) {
        var user = new userModel({
            loginId: req.body.loginId,
            name: req.body.name,
            password: req.body.password,
            img: req.body.img,
            sex: req.body.sex,
            idNo: req.body.idNo,
            birthday: req.body.birthday,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            group: req.body.group,
            role:1
        });

        user.save(function (err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            __logger.info("新增管理用户(" + req.body.loginId + ")成功");
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        userModel.findOne(doc).select("name phone group status").populate("group").exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            res.json(doc);
        });
    }).fail(function (cont, error) {
        __logger.error("新增管理用户(" + req.body.loginId + ")失败:" + error.message);
        res.status(400).send(error.message);
    });

};

exports.list = function (req, res) {
    userModel.find().populate("group").exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });

};

exports.detail = function (req, res) {
    userModel.findById(req.body.id).populate("group").exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.edit = function (req, res) {
    var user = {
        name: req.body.name,
        //password: req.body.password,
        //img: req.body.img,
        sex: req.body.sex,
        idNo: req.body.idNo,
        birthday: req.body.birthday,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        //status: req.body.status,
        group: req.body.group
    };
    if(req.body.password){
        user.password = req.body.password;
    }
    userModel.findByIdAndUpdate(req.body.id, user, function (err, doc) {
        if (err) {
            __logger.error("修改管理用户(" + req.body.loginId + ")失败:" + err.message);
            res.status(400).send(err.message);
            return;
        }
        __logger.info("修改管理用户(" + req.body.loginId + ")成功");
        res.json("success");
    });
};

exports.delete = function (req, res) {
    userModel.findByIdAndRemove(req.body.id, function (err, doc) {
        if (err) {
            __logger.error("删除管理用户(" + req.body.id + ")失败:" + err.message);
            res.status(400).send(err.message);
            return;
        }
        __logger.info("删除管理用户(" + req.body.id + ")成功");
        res.json("success");
    });
};

exports.lock = function(req, res) {
    var user = {
        status: 2
    }

    userModel.findByIdAndUpdate(req.body.id, user, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
}

exports.unlock = function (req, res) {
    var user = {
        status: 1
    }

    userModel.findByIdAndUpdate(req.body.id, user, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};