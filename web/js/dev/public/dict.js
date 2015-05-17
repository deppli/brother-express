define(["angular", "common"], function(angular) {
	angular.module("ngDict", ["ngCommon"])
    .factory("$constants", [function() {
        return {
            NAME_COMPANY_NAME: "仲良速递",
            NAME_EXPORT_ORDER_EXCEL_TYPEA_NAME: "行邮.xlsx",
            NAME_EXPORT_ORDER_EXCEL_TYPEB_NAME: "包税.xlsx",
            STATUS_ORDER_CLEARANCE:5,        //清关中
            TYPE_ORDER_SINGLE:0,        //默认订单
            TYPE_ORDER_BATCH:1,         //批量订单
            MESSAGE_FORM_INVALID : "请确认输入要素正确性",
            MESSAGE_FORM_PRODUCTS_MUST_EXIST:"产品详情不能为空",
            MESSAGE_DIALOG_TYPE_CONF:1,     //确认对话框
            MESSAGE_DEFAULT_TEXT: "请确认点击关闭",
            MESSAGE_CONF_EXIT:"确认退出?",
            MESSAGE_SUCCESS_SETTINGS_UPDATE:"系统参数更新成功",
            MESSAGE_CONF_DEL_NEW:"确认删除选定新闻/公告记录?",
            MESSAGE_CONF_DEL_ORDER:"确认删除选定订单记录?",
            MESSAGE_CONF_DEL_USER:"确认删除选定用户记录?",
            MESSAGE_CONF_LOCK_USER:"确认冻结选定用户记录?",
            MESSAGE_CONF_DEL_GROUP:"确认删除选定分组记录?",
            MESSAGE_SUCCESS_NEW_ORDER:"订单创建成功",
            MESSAGE_SUCCESS_NEW_USER:"用户创建成功",
            MESSAGE_SUCCESS_NEW_GROUP:"分组创建成功",
            MESSAGE_SUCCESS_DEL_USER:"用户已删除",
            MESSAGE_SUCCESS_LOCK_USER:"用户已冻结",
            MESSAGE_SUCCESS_UNLOCK_USER:"用户已解冻",
            MESSAGE_FILE_TOO_BIG:"上传文件超出系统限制",
            MESSAGE_FILE_ONLY_XLSX:"当前仅支持上传xlsx类型文件",
            MESSAGE_FILE_EXCEL_COMMIT_SUCCESS:"批量文件同步成功",
            MESSAGE_FILE_MUST_UPLOADED:"请先成功上传文件",
            MESSAGE_FILE_EXCEL_PROCESSING:"文档解析中，请稍等",
            MESSAGE_FILE_EXCEL_CONTENT_ERROR:"批量文档内容有误",
            MESSAGE_FILE_EXCEL_EXCHANGE_EMPTY:"获取汇率失败，请重新查询更新",
            MESSAGE_MUST_UPLOAD_IDNO:"请先上传完整身份证信息",
            MESSAGE_ORDER_PATH_UPDATE_BATCH_CHECK_ERR:"批次号为空，不能批量更新轨迹",
            MESSAGE_ORDER_PATH_UPDATE_BATCH_SUCCESS:"批量订单轨迹更新成功",
            MESSAGE_ORDER_PATH_UPDATE_SUCCESS:"订单轨迹更新成功",
            MESSAGE_ORDER_EXPORT_HY:"将导出一天内状态为清关中行邮数据",
            MESSAGE_ORDER_EXPORT_BS:"将导出一天内状态为清关中包税数据",
            MESSAGE_CONF_DEL_ORDER:"确认删除选定订单记录?",
            MESSAGE_PAY_FOR_ORDER:"订单支付中，请通过跳转链接完成支付流程"
        };
    }])
	.factory("$dict", [function() {
        var dictionay = {
            IsOrNot: {
                "0": "否",
                "1": "是"
            },
            Sex: {
                "0": "男",
                "1": "女"
            },
            NewType: {
                "0": "新闻",
                "1": "公告",
                "2": "活动"
            },
            NewDisplayType: {
                "0": "普通",
                "1": "最新",
                "2": "火爆"
            },
            NewStatus: {
                "0": "普通",
                "9": "其他"
            },
            UserStatus: {
                "0": "其他",
                "1": "正常",
                "2": "冻结"
            },
            CustomerStatus: {
                "0": "其他",
                "1": "正常",
                "2": "冻结"
            },
            OrderType: {
                "0": "一般订单",
                "1": "批量订单",
                "2": "会员订单",
                "3": "游客订单"
            },
            OrderStatus: {
                "0": "订单生成",
                "1": "订单入仓",
                "2": "订单出货",
                "3": "国际物流",
                "4": "抵港提货",
                "5": "清关中",
                "9": "完成"
            },
            GateMode: {
                "0": "行邮",
                "1": "包税"
            },
            ProductType: {
                "1000000": "食品、饮料",
                "2000000": "酒",
                "3000000": "烟草",
                "4000000": "纺织品及其制成品",
                "5000000": "皮革服装及配饰",
                "6000000": "箱包和鞋靴",
                "7000000": "表、钟及其配件、附件",
                "7010100": "高档手表(一万人民币以上)",
                "8000000": "金、银、珠宝及其制品、艺术品、收藏品",
                "9000000": "化妆品",
                "10000000": "家用医疗、保健及美容器材",
                "11000000": "厨卫用具及小家电",
                "12000000": "家具",
                "13000000": "空调及其配件、附件",
                "14000000": "电冰箱及其配件、附件",
                "15000000": "洗衣设备及其配件、附件",
                "16000000": "电视机及其配件、附件",
                "17000000": "摄影（像）设备及其配件、附件",
                "18000000": "影音设备及其配件、附件",
                "19000000": "计算机及其外围设备",
                "20000000": "书报、刊物及其他各类印刷品",
                "21000000": "教育专用的电影片、幻灯片、原版录音带、录像带",
                "22000000": "文具用品、玩具",
                "23000000": "邮票",
                "24000000": "乐器",
                "25000000": "体育用品",
                "25010000": "高尔夫球及球具",
                "26000000": "自行车、三轮车、童车及其配件、附件",
                "27000000": "其他"
            },GateRate: {
                "1000000": 0.1,
                "2000000": 0.5,
                "3000000": 0.5,
                "4000000": 0.2,
                "5000000": 0.1,
                "6000000": 0.1,
                "7000000": 0.2,
                "7010100": 0.3,
                "8000000": 0.1,
                "9000000": 0.1,
                "10000000": 0.1,
                "11000000": 0.2,
                "12000000": 0.1,
                "13000000": 0.2,
                "14000000": 0.2,
                "15000000": 0.2,
                "16000000": 0.2,
                "17000000": 0.2,
                "18000000": 0.2,
                "19000000": 0.1,
                "20000000": 0.1,
                "21000000": 0.1,
                "22000000": 0.1,
                "23000000": 0.1,
                "24000000": 0.2,
                "25000000": 0.1,
                "25010000": 0.3,
                "26000000": 0.2,
                "27000000": 0.1
            }
        }
        return {
            set: function(key, value){
                dictionay[key] = value;
            },
            get: function(key){
                if(key){
                    return dictionay[key];
                }else{
                    return dictionay;
                }
            }
        }
	}])
    .filter("dict", ["$dict", function($dict) {
        return function(text, param) {
            if (text === undefined) {
                return;
            }
            if (!$dict.get(param) || $dict.get(param)[text] === undefined) {
                return text;
            }
            return $dict.get(param)[text];
        };
    }]);
});
