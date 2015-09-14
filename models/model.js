var mongoose = require('mongoose'),
    db = require('../db'),
    Schema = mongoose.Schema;

//{'paramsId' : '0A001', 'paramsName' : '美元', 'paramsGroup' : '0A', 'paramsGroupName' : '汇率', 'paramsValue' : '0.16'}
//{'paramsId' : '0B001', 'paramsName' : '注册会员赠送余额', 'paramsGroup' : '0B', 'paramsGroupName' : '折扣', 'paramsValue' : '20'}
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
    balance: {type: Number, default:0}, //账户余额
    level: {type: String, default: '0'},  //等级, 0-普通会员
    point: {type: Number, default:0},   //积分
    exp: {type: Number,default:0},  //成长值
    totalPay: {type: Number, default:0},//累积充值
    createDate: {type: Date, default: Date.now},//创建日期
    status: {type: String, default: 1},//用户状态：1正常 2冻结 0其他
    role: {type: Schema.Types.ObjectId, ref: 'Role'}
});

var GroupSchema = new Schema({
    type: {type: String, default: 0},//组类型:9-根用户,0-基本用户
    name: {type: String, required: true, unique: true},
    description: {type: String},
    status: {type: String, default: 0},
    menu: [{type: Schema.Types.ObjectId, ref:'Menu'}]
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
    group: {type: Schema.Types.ObjectId, ref: 'Group', required: true}
});

var MenuSchema = new Schema({
    id: {type:String,require:true,unique:true},
    name: {type:String,require:true},
    description: {type:String},
    link: {type:String},
    role: {type:String},
    level: {type:String},
    subMenu: [{type: Schema.Types.ObjectId, ref: 'Menu'}]
})

var OrderSchema = new Schema({
    id: {type: String, required: true, unique:true},
    idBatch: {type: String},    //批量编号
    idGate: {type: String},     //清关编号
    gateMode: {type: String, default: 0},   //清关模式  0:行邮，1:包税
    gateApi: {type: String, default: 0},    //清关公司编号，后续扩展对接不同清关公司Api接口,0-深圳,1-天津
    type: {type: String, default: 0},   //0-基本订单，1-批量导入订单，2-会员创建订单，3-游客订单
    payStatus: {type: String, default: 0},   //0-未支付,1-已支付,2-已审核
    status: {type: String, default: 0}, //状态:0-订单生成，1-订单入仓，2-订单出货，3-国际物流，4-抵港提货，5-清关中, 9-完成
    name: {type: String, required: true},
    idNoImgA: {type: String},
    idNoImgB: {type: String},
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
    worldTransName: {type: String},     //国际物流商
    worldTransId: {type: String},       //国际物流单号
    chinaTransId: {type: String},       //国内物流商
    chinaTransName: {type: String},     //国内物流单号
    sendName: {type: String, default: "仲良速递"},           //寄件人名称
    sendAddress: {type: String, default: "1507 College Point Blvd"},        //寄件人地址
    sendPhone: {type: String, default: "7183530343"},          //寄件人联系方式
    receiveName: {type: String},        //收件人名称
    receiveProvince: {type: String},    //收件省份
    receiveProvinceName: {type: String},//收件省份名称
    receiveCity: {type: String},        //收件城市
    receiveCityName: {type: String},    //收件城市名称
    receiveArea: {type: String},        //收件地区
    receiveAreaName: {type: String},    //收件地区名称
    receiveAddress: {type: String},     //收件地址
    receivePhone: {type: String},       //收件电话
    receiveZipCode: {type: String},     //收件邮编
    payerName: {type: String},          //付款人姓名
    payerPhone: {type: String},         //付款人电话
    payerIdType: {type: String, default: "身份证"},        //付款人证件类型
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
            pType: {
                key:{type: String},
                value:{type: String}
            },
            pName: {type: String},
            pBrand: {type: String},
            pNum: {type: Number},
            pUnit: {type: String, default:''},
            pAmount: {type: Number},
            pTotalAmount: {type: Number},
            pWeight: {type: Number},
            pRemark: {type: String},
            pTransName: {type: String, default:''},
            pTransId: {type: String, default:''}
        }
    ],
    manager: {type: String},            //责任人
    transportAmount: {type: Number, default: 0},    //运费
    taxAmount: {type: Number, default: 0},          //税费
    safeAmount: {type: Number, default: 0},         //保价费用
    otherAmount: {type: Number, default: 0},        //其他费用
    currency: {type: String, default: 'CNY'},   //默认人民币
    isFixed: {type: String, default: '0'},            //加固标志 0-否,1-是
    isFast: {type: String, default: '0'},             //加急标志 0-否,1-是
    isProtected: {type: String, default: '0'},         //保价 0-否,1-是
    flagBox: {type: String, default: '0'},            //专业包装箱 0-否,1-是
    flagDetailProduct: {type: String, default: '0'},             //内件清点 0-否,1-是
    flagElec: {type: String, default: '0'},         //电子设备保险 0-否,1-是
    flagRemovePages: {type: String, default: '0'},            //取出发票/宣传资料 0-否,1-是
    flagReturnProduct: {type: String, default: '0'},             //退换货服务 0-否,1-是
    flagStore: {type: String, default: '0'}         //仓储服务 0-否,1-是
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
    creater:{type: Schema.Types.ObjectId, ref: 'User'},
    createTime: {type:Date, default: Date.now},
    beginDate: {type:Date, default: Date.now},
    endDate: {type:Date},
    displayType: {type:String, default:0},  //展示类型，0：默认，1：显示new标识
    status: {type: String, default:0}   //状态 - 0:正常
});

var ProvincesSchema = new Schema({
    seq: {type: String},
    provinceId: {type: String, unique:true},
    provinceName: {type: String}
});
var CitysSchema = new Schema({
    seq: {type: String},
    cityId: {type: String, unique:true},
    cityName: {type: String},
    provinceId: {type: String},
    zipCode: {type: String}
});
var AreasSchema = new Schema({
    seq: {type: String},
    areaId: {type: String, unique:true},
    areaName: {type: String},
    cityId: {type: String}
});
var MsgsSchema = new Schema({
    id: {type: String},
    title: {type: String},
    from: {type: String},
    to: {type: String},
    details: [
        {
            time: {type: Date, default: Date.now()},
            from: {type: String},
            to: {type: String},
            content: {type: String}
        }
    ]
})

exports.Params = db.mongoConn.model('Params', ParamsSchema, 'Params');
exports.Province = db.mongoConn.model('Province', ProvinceSchema, 'Province');
exports.City = db.mongoConn.model('City', CitySchema, 'City');
exports.Role = db.mongoConn.model('Role', RoleSchema, 'Role');
exports.Customer = db.mongoConn.model('Customer', CustomerSchema, 'Customer');
exports.Group = db.mongoConn.model('Group', GroupSchema, 'Group');
exports.User = db.mongoConn.model('User', UserSchema, 'User');
exports.Product = db.mongoConn.model('Product', ProductSchema, 'Product');
exports.Order = db.mongoConn.model('Order', OrderSchema, 'Order');
exports.News = db.mongoConn.model('News', NewsSchema, 'News');
exports.Menu = db.mongoConn.model('Menu', MenuSchema, 'Menu');

exports.Provinces = db.mongoConn.model('Provinces', ProvincesSchema, 'Provinces');
exports.Citys = db.mongoConn.model('Citys', CitysSchema, 'Citys');
exports.Areas = db.mongoConn.model('Areas', AreasSchema, 'Areas');
exports.Msgs = db.mongoConn.model('Msgs', MsgsSchema, 'Msgs');