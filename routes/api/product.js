var model = require('./../../models/model'),
    productModel = model.Product,
    msg = require("../../resource/msg"),
    then = require("thenjs");

exports.add = function (req, res) {
    then(function (cont) {
        var product = {
            id: req.body.id
        };

        productModel.findOne(product).exec(function(err, doc) {
            if (err) {
                cont(new Error(err));
                return;
            }
            if (doc) {
                cont(new Error(msg.Product.productIdExist));
                return;
            }
            cont(null, doc);
        });
    }).then(function(cont, doc) {
        var product = new productModel({
            id: req.body.id,
            type: req.body.type,
            name: req.body.name
        });

        product.save(function (err, doc) {
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
    productModel.find(function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(doc);
    });
};

exports.detail = function (req, res) {
    productModel.findById(req.body.dbId, function (err, doc) {
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
        name: req.body.name
    };
    productModel.findByIdAndUpdate(req.body.dbId, update, undefined, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};

exports.delete = function (req, res) {
    productModel.findOneAndRemove(req.body.dbId, undefined, function (err, doc) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json("success");
    });
};