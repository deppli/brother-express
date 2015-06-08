module.exports = {
    MAIN: {
        companyName: '仲良速递',
        err: '错误提示',
        dbErr: '数据库错误',
        validateEmail: '邮箱验证未完成',
        registerClose: '暂时关闭注册，请稍后再来！',
        globalDomainErr: '域名错误',
        globalUrlErr: '网站网址错误',
        globalEmailErr: '管理员Email错误',
        requestDataErr: '请求数据错误',
        requestOutdate: '请求数据已过期',
        requestSent: '请求成功，验证链接已发送到您的邮箱，有效期24小时，请及时验证！',
        resetInvalid: '请求无效',
        resetOutdate: '请求已过期',
        timeIntervalErr: '操作太快啦，休息几秒再来',
        balanceNotEnough: '余额不足'
    },
    USER: {
        loginIdErr: "用户名格式错误",
        UidNone: '用户不存在',
        userNone: '用户不存在或已冻结',
        loginIdNone: '用户名不存在',
        loginIdExist: '用户名已存在',
        userEmailNone: 'Email不存在',
        userEmailErr: 'Email格式错误',
        userEmailExist: 'Email已存在',
        userEmailNotMatch: 'Email与用户名不匹配',
        userPasswd: '密码错误',
        userNeedLogin: '登录状态已失效，请重新登录后操作',
        userLocked: '用户已被锁定',
        loginAttempts: '登录失败超过5次，用户被锁定',
        logNameErr: '该用户不存在，请使用用户名、用户邮箱或用户UID登录'
    },
    GROUP: {
        groupIdExist: '用户组已存在',
        groupNone: '用户组不存在',
        groupInUse: '当前用户组存在用户使用记录'
    },
    PRODUCT: {
        productIdExist: '产品编号已存在'
    },
    ORDER: {
        orderExcelParseError: "批量文件解析失败",
        orderUpdateFail: '订单状态更新失败',
        orderPathSyncError: '获取第三方轨迹信息失败,请重试',
        orderUpdateInfoFail: '订单更新轨迹同步失败,请重新更新',
        orderIdExist: '订单编号已存在',
        orderIdNotExist: '订单编号不存在'
    },
    NEWS: {

    }
};