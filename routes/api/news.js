var model = require('./../../models/model'),
    newsModel = model.News,
    msg = require("../../resource/msg"),
    then = require("thenjs");

exports.add = function (req, res) {
    then(function(cont) {
        var news = new newsModel({
            type: req.body.type,
            title: req.body.title,
            content: req.body.content,
            creater: req.body.creater,
            beginDate: req.body.beginDate,
            endDate: req.body.endDate,
            displayType: req.body.displayType
        });

        news.save(function (err, doc) {
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

exports.list = function (req, res) {
    newsModel.find(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.detail = function (req, res) {
    newsModel.findById(req.body.id, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.edit = function (req, res) {
    var update = {
        type: req.body.type,
        title: req.body.title,
        content: req.body.content,
        beginDate: req.body.beginDate,
        endDate: req.body.endDate,
        displayType: req.body.displayType
    };
    newsModel.findByIdAndUpdate(req.body.id, update, undefined, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};

exports.delete = function (req, res) {
    newsModel.findOneAndRemove(req.body.id, undefined, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};