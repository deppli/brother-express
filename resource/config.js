var config = {
    partner:'2088911134104503' //合作身份者id，以2088开头的16位纯数字
    ,key:'ems66ios369p7ef42hr0obm76durfljp'//安全检验码，以数字和字母组成的32位字符
    ,seller_email:'admin@brother-express.com' //卖家支付宝帐户 必填
    ,host:'http://www.brother-express.com/'
    ,transport:'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    ,input_charset:'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
};

var Alipay = require('alipay').Alipay;

exports.alipay = new Alipay(config);

exports.basic = {
    UPLOAD_PATH: '/home/zhanghuan/servers/brother-express/upload/',
    UPLOAD_IDNO_PATH: '/home/zhanghuan/servers/brother-express/web/upload/idno/',
    EXPRESS_API_HOST: 'track.kuaidi.hk',
    EXPRESS_API_PORT: 8089,
    EXPRESS_API_PATH: '/cgi-bin/GInfo.dll?EmsApiTrack&ntype=+10000&',
    EXPRESS_API_METHOD: 'GET',
    EXPRESS_TJ_API_HOST: 'api.yi-ex.com/',
    EXPRESS_TJ_API_PORT: 80,
    EXPRESS_TJ_API_PATH: '/track?',
    EXPRESS_TJ_API_METHOD: 'GET',
    SYSTEM_HOST: 'http://www.brother-express.com'
};