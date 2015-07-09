var express = require("express"),
    bodyParser = require("body-parser"),
    log4js = require("log4js"),
    path = require("path"),
    hooks = require("./hooks/hooks").hooks,
    app = express(),
    session = require("express-session"),
    db = require("./db");

var customer = require("./routes/api/customer"),
    group = require("./routes/api/group"),
    user = require("./routes/api/user"),
    product = require("./routes/api/product"),
    order = require("./routes/api/order"),
    orderBatch = require("./routes/api/orderBatch"),
    news = require("./routes/api/news"),
    service = require("./routes/api/service"),
    alipayApi = require("./routes/api/alipayApi");

// 带"install"参数启动则初始化MongoDB，完成后退出
if (process.argv.indexOf("install") > 0) {
    require("./util/install.js")().then(function () {
        logger.info("logistics_server installed!");
        db.mongoConn.close();
    }).fail(function(cont, error) {
        logger.error(error);
    }).fin(function(cont) {
        process.exit(1);
    });
    return;
}

//var HTTP_LOG_FORMAT_DEV = ':method :url :status :response-time ms';
//app.use(log4js.connectLogger(__logger, {level: "auto", format: HTTP_LOG_FORMAT_DEV}));

var circle = 36000*1000
app.use(session({
    resave: false, // don"t save session if unmodified
    cookie: {httpOnly: true, expires: new Date(Date.now() + circle), maxAge: circle},   //2小时
    saveUninitialized: false, // don"t create session until something stored
    secret: "logistics_server"
}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "/web")));
app.set('views', __dirname + '/web');
app.set('view engine', 'ejs');

var wechat = require('wechat');
var config = {
    token: 'brother-express',
    appid: 'wx7aae9121e7cab6f0',
    encodingAESKey: '1KwxH9lqocwDgfnJJvWniLFv0gwAVgDgPbHayZHtaHQ'
};
var model = require('./models/model'),
    orderModel = model.Order;
app.use(express.query()); // Or app.use(express.query());
app.use('/wxtoken', wechat(config, function (req, res, next) {
    orderModel.find().exec(function(err, doc) {
        if (err) {
            res.reply("查询失败")
            return;
        }
        res.reply(doc)
    });
}));

app.post("/news/add", hooks.role(),news.add);
app.post("/news/list", hooks.role(),news.list);
app.post("/news/detail", hooks.role(),news.detail);
app.post("/news/edit", hooks.role(),news.edit);
app.post("/news/delete", hooks.role(),news.delete);

app.post("/customer/add", hooks.role(), customer.add);
app.post("/customer/list", hooks.role(),  customer.list);
app.post("/customer/detail", hooks.role(),  customer.detail);
app.post("/customer/edit", hooks.role(),  customer.edit);
app.post("/customer/delete", hooks.role(),  customer.delete);
app.post("/customer/lock", hooks.role(),  customer.lock);
app.post("/customer/unlock", hooks.role(),  customer.unlock);

app.post("/user/add", hooks.role(),  user.add);
app.post("/user/list", hooks.role(),  user.list);
app.post("/user/detail", hooks.role(),  user.detail);
app.post("/user/edit", hooks.role(),  user.edit);
app.post("/user/delete", hooks.role(),  user.delete);
app.post("/user/lock", hooks.role(),  user.lock);
app.post("/user/unlock", hooks.role(),  user.unlock);

app.post("/group/add", hooks.role(),  group.add);
app.post("/group/list", hooks.role(),  group.list);
app.post("/group/detail", hooks.role(),  group.detail);
app.post("/group/edit", hooks.role(),  group.edit);
app.post("/group/delete", hooks.role(),  group.delete);

app.post("/product/add", hooks.role(),  product.add);
app.post("/product/list", hooks.role(),  product.list);
app.post("/product/detail", hooks.role(),  product.detail);
app.post("/product/edit", hooks.role(),  product.edit);
app.post("/product/delete", hooks.role(),  product.delete);

app.post("/order/add", hooks.role(),  order.add);
app.post("/order/list", hooks.role(),  order.list);
app.post("/order/detail", hooks.role(),  order.detail);
app.post("/order/edit", hooks.role(),  order.edit);
app.post("/order/delete", hooks.role(),  order.delete);
app.post("/order/batchDelete", hooks.role(),  order.batchDelete);
app.post("/order/count", hooks.role(),  order.count);
app.post("/order/pathUpdate", hooks.role(),  order.pathUpdate);

app.post("/orderBatch/processExcel", hooks.role(), orderBatch.processExcel);
app.post("/orderBatch/commitExcel", hooks.role(), orderBatch.commitExcel);

app.post("/news/add", hooks.role(),  news.add);
app.post("/news/list", hooks.role(),  news.list);
app.post("/news/detail", hooks.role(),  news.detail);
app.post("/news/edit", hooks.role(),  news.edit);
app.post("/news/delete", hooks.role(),  news.delete);

app.post("/service/getSettings", service.getSettings);
app.post("/service/listSettings", hooks.role(), service.listSettings);
app.post("/service/updateSettings", hooks.role(), service.updateSettings);

app.post("/service/checkCustomer", service.checkCustomer);
app.post("/service/addCustomer", service.addCustomer);
app.post("/service/sendMail", service.sendMail);
app.post("/service/createOrder", service.createOrder);
app.post("/service/queryOrder", service.queryOrder);
app.post("/service/thirdPath", service.thirdPath);
app.post("/service/updateOrder", service.updateOrder);
app.post("/service/updateOrderIdno", service.updateOrderIdno);
app.post("/service/listMenus", service.listMenus);
app.post("/service/listProvinces", service.listProvinces);
app.post("/service/listCitys", service.listCitys);
app.post("/service/checkValidateEmail", service.checkValidateEmail);
app.post("/service/upload", service.upload);
app.get("/service/validateEmail", service.validateEmail);
app.post("/service/fullPath", service.fullPath);
app.post("/service/queryPayStatus", service.queryPayStatus);
app.post("/service/forgetPassword", service.forgetPassword);
app.post("/service/resetPassword", service.resetPassword);

var userBiz = require("./routes/biz/userBiz");
var customerBiz = require("./routes/biz/customerBiz");

app.post("/userBiz/login", userBiz.login);
app.post("/userBiz/logout", userBiz.logout);

app.post("/customerBiz/login", customerBiz.login);
app.post("/customerBiz/logout", customerBiz.logout);
app.post("/customerBiz/createOrder", hooks.role(1), customerBiz.createOrder);
app.post("/customerBiz/queryCustomer", hooks.role(1), customerBiz.queryCustomer);
app.post("/customerBiz/queryBalance", hooks.role(1), customerBiz.queryBalance);
app.post("/customerBiz/listOrder", hooks.role(1), customerBiz.listOrder);
app.post("/customerBiz/payOrder", hooks.role(1), customerBiz.payOrder);
app.post("/customerBiz/queryBanlancePayStatus", hooks.role(1), customerBiz.queryBanlancePayStatus);

alipayApi.route(app);
app.get('/alipay', alipayApi.entry);
app.post('/alipay/create_direct_pay_by_user', alipayApi.create_direct_pay_by_user);
//app.all('/alipay/create_direct_bankpay_by_user', alipayApi.create_direct_bankpay_by_user);
//app.all('/alipay/refund_fastpay_by_platform_pwd', alipayApi.refund_fastpay_by_platform_pwd);
//app.all('/alipay/create_partner_trade_by_buyer', alipayApi.create_partner_trade_by_buyer);
//app.all('/alipay/send_goods_confirm_by_platform', alipayApi.send_goods_confirm_by_platform);
//app.all('/alipay/trade_create_by_buyer', alipayApi.trade_create_by_buyer);

app.set("port", 4001);
app.listen(app.get("port"));
__logger.info("logistics_server start at " + app.get("port"));
