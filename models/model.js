var mongoose = require("mongoose"),
    db = require("../db"),
    Schema = mongoose.Schema;

var ParamsSchema = new Schema({
    paramsId: {type: String, unique:true},
    paramsName: {type: String},
    paramsGroup: {type: String},
    paramsGroupName: {type: String},
    paramsValue: {type: String}
});

var ProvinceSchema = new Schema({
    provinceId: {type: String, unique:true},
    provinceName: {type: String}
});

var CitySchema = new Schema({
    cityId: {type: String, unique:true},
    cityName: {type: String},
    provinceId: {type: String}
});

var RoleSchema = new Schema({
    id: {type: String},
    type: {type: String, default: 0},//权限类型:0-基本权限
    name: {type: String, required: true, unique: true},
    description: {type: String},
    status: {type: String, default: 0},
    roles: [{type:String}]
});

var CustomerSchema = new Schema({
    loginId: {type: String, required: true, unique: true},//用户ID
    openId: {type: String}, //微信ID
    name: {type: String},//姓名
    nickname: {type: String, required: true},
    password: {type: String, required: true},//密码
    img: {type: String},//头像，base64串
    sex: {type: String},//性别
    idNo: {type: String},//证件号
    idNoImgA: {type: String},//证件照正面
    idNoImgB:{type: String},//证件照反面
    birthday: {type: String},//生日
    phone: {type: String},//手机号码
    zipCode: {type: String},    //邮编
    email: {type: String},//电子邮箱
    address: {type: String},//地址
    balance: {type: String}, //账户余额
    level: {type: String},  //等级
    createDate: {type: Date, default: Date.now},//创建日期
    status: {type: String, default: 1},//用户状态：1正常 2冻结 0其他
    role: {type: Schema.Types.ObjectId, ref: "Role"}
});

var GroupSchema = new Schema({
    type: {type: String, default: 0},//组类型:9-根用户,0-基本用户
    name: {type: String, required: true, unique: true},
    description: {type: String},
    status: {type: String, default: 0},
    menu: [{type: Schema.Types.ObjectId, ref:"Menu"}]
});

var UserSchema = new Schema({
    loginId: {type: String, required: true, unique: true},//用户ID
    openId: {type: String}, //微信ID
    name: {type: String, required: true},//姓名
    password: {type: String, required: true},//密码
    img: {type: String},//头像，base64串
    sex: {type: String},//性别
    idNo: {type: String},//证件号
    birthday: {type: String},//生日
    phone: {type: String},//手机号码
    email: {type: String},//电子邮箱
    address: {type: String},//地址
    createDate: {type: Date, default: Date.now},//创建日期
    status: {type: String, default: 1},//用户状态：1正常 2冻结 0其他
    group: {type: Schema.Types.ObjectId, ref: "Group", required: true}
});

var MenuSchema = new Schema({
    id: {type:String,require:true,unique:true},
    name: {type:String,require:true},
    description: {type:String},
    link: {type:String},
    role: {type:String},
    level: {type:String},
    subMenu: [{type: Schema.Types.ObjectId, ref: "Menu"}]
})

var OrderSchema = new Schema({
    id: {type: String, required: true, unique:true},
    idBatch: {type: String},    //批量编号
    idGate: {type: String},     //清关编号
    gateMode: {type: String, default: 0},   //清关模式  0:行邮，1:包税
    gateApi: {type: String, default: 0},    //清关公司编号，后续扩展对接不同清关公司Api接口
    type: {type: String, default: 0},   //0-基本订单，1-批量导入订单，2-会员创建订单
    kind: {type: String, default: 0},   //0-待审核，1-已审核
    name: {type: String, required: true},
    description: {type: String},
    amount: {type: Number},     //订单总金额
    creater: {type: String},
    createTime: {type:Date, default: Date.now},
    updateInfo: [{
        updater: {type: String},
        time: {type: Date, default: Date.now},
        gis: {type: String},
        gisText: {type: String},
        status: {type: String},
        remark: {type: String}
    }],
    status: {type: String, default: 0}, //状态:0-订单生成，1-订单入仓，2-订单出货，3-国际物流，4-抵港提货，5-清关中, 9-完成
    worldTransName: {type: String},     //国际物流商
    worldTransId: {type: String},       //国际物流单号
    chinaTransId: {type: String},       //国内物流商
    chinaTransName: {type: String},     //国内物流单号
    sendName: {type: String},           //寄件人名称
    sendAddress: {type: String},        //寄件人地址
    sendPhone: {type: String},          //寄件人联系方式
    receiveName: {type: String},        //收件人名称
    receiveProvince: {type: String},    //收件省份
    receiveProvinceName: {type: String},//收件省份名称
    receiveCity: {type: String},        //收件城市
    receiveCityName: {type: String},    //收件城市名称
    receiveAddress: {type: String},     //收件地址
    receivePhone: {type: String},       //收件电话
    receiveZipCode: {type: String},     //收件邮编
    payerName: {type: String},          //付款人姓名
    payerPhone: {type: String},         //付款人电话
    payerIdType: {type: String},        //付款人证件类型
    payerIdNo: {type: String},          //付款人证件号码
    payerAddress: {type: String},       //付款人地址
    payerZipCode: {type: String},       //付款人邮编
    productName: {type: String},        //商品统称(总)
    productNum: {type: Number},         //商品数量(总)
    productWeight: {type: Number},      //商品重量(总)
    productAmount: {type: Number},      //商品价值(总)
    products: [
        {
            pId: {type: String},        //产品ID，后续关联产品对象
            pType: {type: String},
            pName: {type: String},
            pBrand: {type: String},
            pNum: {type: Number},
            pUnit: {type: String},
            pAmount: {type: Number},
            pTotalAmount: {type: Number},
            pWeight: {type: Number},
            pRemark: {type: Number}
        }
    ],
    manager: {type: String},            //责任人
    transportAmount: {type: Number},    //运费
    taxAmount: {type: Number},          //税费
    safeAmount: {type: Number},         //保价费用
    otherAmount: {type: Number},        //其他费用
    currency: {type: String, default: "CNY"},   //默认人民币
    isFixed: {type: String},            //加固标志
    isFast: {type: String},             //加急标志
    isProtected: {type: String}         //保价
});

var ProductSchema = new Schema({
    id: {type:String, required: true},
    name: {type: String, required: true},
    description: {type: String}
});

var NewsSchema = new Schema({
    type: {type:String, require:true, default: 0},
    title: {type:String, require:true},
    content: {type: String},
    creater:{type: Schema.Types.ObjectId, ref: "User"},
    createTime: {type:Date, default: Date.now},
    beginDate: {type:Date, default: Date.now},
    endDate: {type:Date},
    displayType: {type:String, default:0},  //展示类型，0：默认，1：显示new标识
    status: {type: String, default:0}   //状态 - 0:正常
});
//db.Menu.update({"name":"公告管理"},{$set:{"name":"订单管理"}},false,true)

//db.Group.update({"type":"0"},{$set:{"menu":[ObjectId("54e0236df152aa2c182ae177")]}},false,true)

exports.Params = db.mongoConn.model("Params", ParamsSchema, "Params");
exports.Province = db.mongoConn.model("Province", ProvinceSchema, "Province");
exports.City = db.mongoConn.model("City", CitySchema, "City");
exports.Role = db.mongoConn.model("Role", RoleSchema, "Role");
exports.Customer = db.mongoConn.model("Customer", CustomerSchema, "Customer");
exports.Group = db.mongoConn.model("Group", GroupSchema, "Group");
exports.User = db.mongoConn.model("User", UserSchema, "User");
exports.Product = db.mongoConn.model("Product", ProductSchema, "Product");
exports.Order = db.mongoConn.model("Order", OrderSchema, "Order");
exports.News = db.mongoConn.model("News", NewsSchema, "News");
exports.Menu = db.mongoConn.model("Menu", MenuSchema, "Menu");