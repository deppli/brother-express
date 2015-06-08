var then = require("thenjs"),
    msg = require("../resource/msg"),
    tools = require("../util/tools");

function hooks(fn) {
    return function(req, res, next) {
        fn(req).then(function() {
            next();
        }).fail(function(cont, error) {
            res.status(400).send(error.message);
        });
    };
}
hooks.role = function(role) {
    function roleCheck(req) {
        return then(function(cont) {
            if(role == 1){
                if (!req.session.customer) {
                    cont(new Error(msg.USER.userNeedLogin));
                    return;
                }
            }else{
            if (!req.session.user) {
                cont(new Error(msg.USER.userNeedLogin));
                return;
            }
            }
            /*switch (typeof role) {
                case "number":
                    if (role != req.session.user.role) {
                        cont(new Error(msg.USER.userRoleErr));
                        return;
                    }
                    break;
                case "object":
                    if (role && role.indexOf(req.session.user.role) != -1) {
                        cont(new Error(msg.USER.userRoleErr));
                        return;
                    }
                    break;
            }*/
            cont();
        });
    }
    return this(roleCheck)
};

exports.hooks = hooks;