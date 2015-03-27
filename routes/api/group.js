var model = require('./../../models/model'),
    userModel = model.User,
    groupModel = model.Group,
    msg = require("../../resource/msg"),
    then = require("thenjs");

exports.add = function (req, res) {
    var group = new groupModel({
        name: req.body.name,
        description: req.body.description,
        menu: req.body.menu
    });
    group.save(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};

exports.list = function (req, res) {
    groupModel.find().populate("menu").exec(function(err, doc){
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.detail = function (req, res) {
    groupModel.findById(req.body.id).populate("menu").exec(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.edit = function (req, res) {
    var update = {
        name: req.body.name,
        description: req.body.description,
        menu: req.body.menu
    };
    groupModel.findByIdAndUpdate(req.body.id, update, undefined, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};

exports.delete = function (req, res) {
    var condition = {group: req.body.id};

    userModel.findOne(condition).exec(function(err, doc){
        if(doc){
            console.log(doc);
            res.status(400).send(msg.GROUP.groupInUse);
            return;
        }

        groupModel.findByIdAndRemove(req.body.id, undefined, function (err, doc) {
            if (err) {
                res.status(400).send(err.message);
                return;
            }
            res.json("success");
        });
    })
};