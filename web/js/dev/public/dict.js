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
            MESSAGE_CONF_DEL_ORDER:"确认删除选定订单记录?"
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
                "2": "会员订单"
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
