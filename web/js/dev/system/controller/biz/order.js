define(["bootstrap-icheck"], function() {
	return [["OrderCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$location",
	function($scope, $rootScope, $remote, $modal, $location) {
        $rootScope._entry = 0;
        $rootScope._cacheOrder = null;  //重置订单缓存

        $scope.goCustomer = function(){
            $rootScope._entry = 1;
            if($rootScope.webInfo && $rootScope.webInfo.isLogin){
                $location.path('orderCustomer')
            }else{
                $rootScope._loginPath = 'orderCustomer';
                $scope.login();
            }
        }

    }]],["OrderStepCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$dict", "$constants", "$config", "$upload",
    function($scope, $rootScope, $remote, $modal, $dict, $constants, $config, $upload) {

        $scope.$watch("idImgA", function(){
            var filename;
            if($scope.payerIdNo && $scope.payerIdNo.length > 10){
                filename = $scope.payerIdNo + "_A";
            }else{
                filename = $scope.orderId + "_A";
            }
            var file = $scope.idImgA;
            if(file){
                $scope.ProgressA = {};
                $scope.idAUrl = null;
                if(file[0].size > $config.maxIdFileSize) {
                    var msg = {text: $constants.MESSAGE_FILE_TOO_BIG};  //200K
                    $scope.showMessage(msg);
                }else{
                    $upload.upload({
                        url: '/service/upload?type=1&file=' + filename,
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressA.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressA.dynamic = 100;
                        $scope.idAUrl = $config.idCardPath + filename + ".jpg"
                    });
                }
            }
        });

        $scope.$watch("idImgB", function(){
            var filename;
            if($scope.payerIdNo && $scope.payerIdNo.length > 10){
                filename = $scope.payerIdNo + "_B";
            }else{
                filename = $scope.orderId + "_B";
            }
            var file = $scope.idImgB;
            if(file) {
                $scope.ProgressB = {};
                $scope.idBUrl = null;
                if(file[0].size > $config.maxIdFileSize) {
                    var msg = {text: $constants.MESSAGE_FILE_TOO_BIG};  //200K
                    $scope.showMessage(msg);
                }else{
                    $upload.upload({
                        url: '/service/upload?type=1&file=' + filename,
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressB.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressB.dynamic = 100;
                        $scope.idBUrl = $config.idCardPath + filename + ".jpg"
                    });
                }
            }
        });

        var nowTime = new Date();
        $scope.orderId = $scope.initJnl("S");
        $scope.orderTransportAmt = 0;
        $scope.orderProtectedAmt = 0;
        $scope.orderFixedAmt = 0;
        $scope.orderFastAmt = 0;
        $scope.orderBoxAmt = 0;
        $scope.orderStoreAmt = 0;
        $scope.orderReturnProductAmt = 0;
        $scope.orderElecAmt = 0;
        $scope.orderDetailProductAmt = 0;
        $scope.orderRemovePagesAmt = 0;
        $scope.orderServiceAmt = 0;
        $scope.orderDiscountAmt = 0;
        $scope.PAY_CHANNEL = 0;
        $scope.STEP = 1;

        $scope.IsFixed = 0;
        $scope.IsFast = 0;
        $scope.IsProtected = 0;
        $scope.FlagStore = 0;
        $scope.FlagBox = 0
        $scope.FlagReturnProduct = 0;
        $scope.FlagElec = 0;
        $scope.FlagDetailProduct = 0;
        $scope.FlagRemovePages = 0;

        $scope.radio0 = 0;
        $scope.radio1 = 1;
        $scope.radio2 = 2;

        var productType = $scope.initOptions("ProductType");
        $scope.ProductTypeList = productType[0];

        $scope.products = [];
        $scope.Check = {};

        $scope.initTestData = function(){
            $scope.orderName = "测试订单";
            $scope.orderTotalAmt = 0.01;
            $scope.worldTransName = "EMS"
            $scope.worldTransId = "10002910"
            $scope.products.push({pType: $scope.ProductTypeList[0], pName: '包包', pBrand: 'LV', pAmount: 20, pNum: 2, pUnit: '件', pWeight: 1.3, pTransName: 'DHL', pTransId: '10920000192018'});

            $scope.payerIdType = "身份证";
            $scope.payerName = "洪七公";
            $scope.payerPhone = "13782718821";
            $scope.payerZipCode = "200000";
            $scope.payerIdNo = "431291198301239980";
            $scope.payerAddress = "上海市长宁区桃李路1121号";

            $scope.receiveName = "周伯通";
            $scope.receivePhone = "13398220098";
            $scope.receiveZipCode = "210000";
            $scope.receiveIdType = "身份证";
            $scope.receiveIdNo = "431291198301239980";
            $scope.receiveAddress = "北京市王府井8827号";
            //$scope._entry = 1;
            //$scope.balance = 2000;
        }

        //TODO 测试用，初始化测试数据，上线删除
        //$scope.initTestData();

        //若从会员中心直接支付
        if($rootScope._cacheOrder){
            $scope.orderId = $rootScope._cacheOrder.id;
            $scope.orderTotalAmt = $rootScope._cacheOrder.amount;
            $scope.orderName = $rootScope._cacheOrder.name;
            $rootScope._cacheOrder = null;
            $rootScope._entry = 1;
            $scope.STEP = 4;
        }

        $scope.$watch("products", function(){
            var totalNum = 0;
            var totalAmount = 0;
            var totalWeight = 0;
            var productNames = "";
            var pRate = 0;
            var pRateAmt = 0;
            var mRateAmt = 0;   //减税税额
            $scope.products.forEach(function(each){
                totalNum += each.pNum||0;
                totalAmount += each.pTotalAmount||0;
                totalWeight += each.pWeight||0;
                productNames += each.pName||"";
                pRate = $dict.get("GateRate")[each.pType.key]||0;
                var rates = each.pTotalAmount * pRate;
                pRateAmt += rates;
                if(each.pType.key == "1000000" || each.pType.key == "4000000" || each.pType.key == "5000000"
                    || each.pType.key == "6000000" || each.pType.key == "7000000" || each.pType.key == "9000000"){
                    each.pReduce = 1;
                }else{
                    each.pReduce = 0;
                    mRateAmt += rates;
                }
            })
            $scope.productNum = totalNum;
            $scope.productAmount = totalAmount;
            $scope.productWeight = totalWeight;
            $scope.productName = productNames;
            if($scope.productAmount > 1000){
            $scope.orderRateAmt = pRateAmt||0;
                $scope.rateReduce = 0;
            }else{
                $scope.orderRateAmt = mRateAmt||0;
                $scope.rateReduce = 1;
            }
            if($scope.orderRateAmt > 0){
                $scope.orderRateAmt = Math.round($scope.orderRateAmt * 100)/100;
            }
            var stepWeight = $scope.productWeight - 0.5;
            if(stepWeight <= 0 ){
                $scope.orderTransportAmt = $config.onlineOrderTransportBasicCost;
            }else{
                $scope.orderTransportAmt = $config.onlineOrderTransportBasicCost + Math.ceil(stepWeight * 10) * $config.onlineOrderTransportStepCost
            }
            //总重量不能大于3kg
            if(totalWeight > 3){
                $scope.Check.isOverWeight = true;
            }else{
                $scope.Check.isOverWeight = false;
            }
            //总金额不能大于1000元
            if(totalNum > 1 && totalAmount > $config.onlineOrderLimit){
                $scope.Check.isOverAmt = true;
            }else{
                $scope.Check.isOverAmt = false;
            }
        },true);

        $scope.getProvinces(function(){
            var provinces = $scope.initOptions("Provinces");
            $scope.ProvinceList = provinces[0];
            $scope.receiveProvince = $scope.ProvinceList[provinces[1]];
            $scope.initCitys();
        });

        $scope.initCitys = function(){
            if($scope.receiveProvince){
                $scope.getCitys($scope.receiveProvince.key, function(){
                    var citys = $scope.initOptions("Citys");
                    $scope.CityList = citys[0];
                    $scope.receiveCity = $scope.CityList[citys[1]];
                });
            }
        }

        $scope.addProduct = function(){
            $scope.products.push({pType: $scope.ProductTypeList[0]});
        }

        $scope.removeProduct = function(index){
            $scope.products.splice(index,1);
        }

        $scope.queryBalance = function(){
            if($scope._entry == 1){
                $remote.post("/customerBiz/queryBalance", null, function(data){
                    if(data){
                        $scope.balance = data.balance || 0;
                        $scope.balanceLast = $scope.balance - $scope.orderTotalAmt;
                        if($scope.balanceLast < 0){
                            $scope.balanceLess = true;
                        }
                    }
                });
            }
        }

        $scope.payChannelCheck = function(channel){
            $scope.PAY_CHANNEL = channel;
            if(channel == 1){
                $scope.queryBalance();
            }
        }

        $scope.updatePayStatus = function(){
            var postData = {
                orderId: $scope.orderId
            }
            $remote.post("/service/queryPayStatus", postData, function(data){
                console.log(data);
                if(data && data.payStatus == "1"){
                    $scope.STEP++;
                }else{
                    var msg = {text:$constants.MESSAGE_PAY_STATUS_FAIL}
                    $scope.showMessage(msg);
                }
            });
        }

        $scope.nextStep = function(step){
            switch(step){
                case 1:
                    if($scope.checkForm($scope.customerOrder)){
                        if($scope.Check.isOverWeight){
                            var msg = {text:$constants.MESSAGE_PRODUCT_DETAIL_OVER_WEIGHT};
                            $scope.showMessage(msg);
                            return;
                        }
                        if($scope.Check.isOverAmt){
                            var msg = {text:$constants.MESSAGE_PRODUCT_DETAIL_OVER_AMOUNT};
                            $scope.showMessage(msg);
                            return;
                        }
                        if($rootScope._entry == 1){
                            $scope.payerIdType = "身份证";
                            $remote.post("/customerBiz/queryCustomer", null, function(data){
                                $scope.payerName = data.name;
                                $scope.payerPhone = data.phone;
                                $scope.payerZipCode = data.zipCode;
                                $scope.payerIdNo = data.idNo;
                                $scope.payerAddress = data.address;
                                $scope.idAUrl = data.idNoImgA;
                                //$scope.idBUrl = data.idNoImgB;
                            })
                            //$scope.payerName = $rootScope.webInfo.name;
                            //$scope.payerPhone = $rootScope.webInfo.phone;
                            //$scope.payerZipCode = $rootScope.webInfo.zipCode;
                            //$scope.payerIdNo = $rootScope.webInfo.idNo;
                            //$scope.payerAddress = $rootScope.webInfo.address;
                        }
                        //$scope.orderTransportAmt = $scope.total
                        $scope.onlineProtectedCost = $scope.productAmount / 50;
                        $scope.onlineElecCost = $scope.productAmount / 50 + $config.onlineOrderElecCost;
                        $scope.STEP++;
                    }
                    break;
                case 2:
                    if($scope.checkForm($scope.customerInfo)){
                        //加急
                        if($scope.IsFast == 1){
                            $scope.orderFastAmt = $config.onlineOrderFastCost;
                        }
                        //包裹加固
                        if($scope.IsFixed == 1){
                            $scope.orderFixedAmt = $config.onlineOrderFixedCost;
                        }
                        //保价
                        if($scope.IsProtected == 1){
                            $scope.orderProtectedAmt = $scope.onlineProtectedCost||0;
                        }
                        //专业包装箱
                        if($scope.FlagBox == 1){
                            $scope.orderBoxAmt = $config.onlineOrderBoxCost;
                        }
                        //仓储服务
                        if($scope.FlagStore == 1){
                            $scope.orderStoreAmt = $config.onlineOrderStoreCost1;
                        }else if($scope.FlagStore == 2){
                            $scope.orderStoreAmt = $config.onlineOrderStoreCost2;
                        }
                        //退换货服务
                        if($scope.FlagReturnProduct == 1){
                            $scope.orderReturnProductAmt = $config.onlineOrderReturnCost;
                        }
                        //电子产品保险
                        if($scope.FlagElec == 1){
                            $scope.orderElecAmt = $scope.onlineElecCost;
                        }
                        //内件清点
                        if($scope.FlagDetailProduct == 1){
                            $scope.orderDetailProductAmt = $config.onlineOrderDetailProductCost;
                        }
                        //取出发票/宣传资料
                        if($scope.FlagRemovePages == 1){
                            $scope.orderRemovePagesAmt = $config.onlineOrderRemovePagesCost;
                        }
                        $scope.orderServiceAmt = $scope.orderFastAmt + $scope.orderFixedAmt + $scope.orderProtectedAmt + $scope.orderBoxAmt
                        + $scope.orderStoreAmt + $scope.orderReturnProductAmt + $scope.orderElecAmt + $scope.orderDetailProductAmt + $scope.orderRemovePagesAmt;

                        //产品价值高于2500元才计算报税费用
                        if($scope.productAmount > 2500){
                        $scope.orderTotalAmt = $scope.orderTransportAmt + $scope.orderRateAmt + $scope.orderServiceAmt - $scope.orderDiscountAmt;
                        }else{
                            $scope.orderTotalAmt = $scope.orderTransportAmt + $scope.orderServiceAmt - $scope.orderDiscountAmt;
                            $scope.noRate = true;
                        }
                        if($scope.idAUrl && $scope.idBUrl){
                            $scope.STEP++;
                        }else{
                            var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_NEXT_STEP_WITHOUT_IDIMG, confCallback:function(){
                                $scope.STEP++;
                            }};
                            $scope.showMessage(msg);
                        }
                    }
                    break;
                case 3:
                    if(!$scope.products || $scope.products.length == 0){
                        var msg = {text:$constants.MESSAGE_FORM_PRODUCTS_MUST_EXIST};
                        $scope.showMessage(msg);
                        return;
                    }

                    var postData = {
                        id: $scope.orderId,
                        //type: $constants.TYPE_ORDER_SINGLE,        //后台新建订单
                        name: $scope.orderName,
                        creater: "管理员",
                        gateMode: 0,
                        idAUrl: $scope.idAUrl,
                        idBUrl: $scope.idBUrl,
                        amount: $scope.orderTotalAmt || 0,
                        worldTransId: $scope.orderId,
                        worldTransName: $constants.NAME_COMPANY_NAME,
                        chinaTransId: $scope.chinaTransId || "",
                        chinaTransName: $scope.chinaTransName || "",
                        payerName: $scope.payerName || "",
                        payerPhone: $scope.payerPhone || "",
                        payerIdType: $scope.payerIdType || "",
                        payerIdNo: $scope.payerIdNo || "",
                        payerAddress: $scope.payerAddress || "",
                        payerZipCode: $scope.payerZipCode || "",
                        sendName: $scope.sendName || $constants.NAME_COMPANY_NAME,
                        sendAddress: $scope.sendAddress || "上海市长宁区愚园路1240号绿地商务大厦1602",
                        sendPhone: $scope.sendPhone || "021-52927675",
                        receiveName: $scope.receiveName || "",
                        receiveProvince: $scope.receiveProvince.key || "",
                        receiveProvinceName: $scope.receiveProvince.value || "",
                        receiveCity: $scope.receiveCity.key || "",
                        receiveCityName: $scope.receiveCity.value || "",
                        receiveAddress: $scope.receiveAddress || "",
                        receivePhone: $scope.receivePhone || "",
                        receiveZipCode: $scope.receiveZipCode || "",
                        productName: $scope.productName || "",
                        productNum: $scope.productNum || 0,
                        productAmount: $scope.productAmount || 0,
                        productWeight: $scope.productWeight || 0,
                        products: $scope.products||[],          //产品列表
                        transportAmount: $scope.orderTransportAmt || 0,
                        taxAmount: $scope.orderRateAmt || 0,
                        safeAmount: $scope.orderProtectedAmt || 0,
                        otherAmount: $scope.orderServiceAmt - $scope.orderProtectedAmt || 0,
                        isFixed: $scope.IsFixed || 0,
                        isFast: $scope.IsFast || 0,
                        isProtected: $scope.IsProtected || 0,
                        flagBox: $scope.FlagBox || 0,
                        flagDetailProduct: $scope.FlagDetailProduct || 0,
                        flagElec: $scope.FlagElec || 0,
                        flagRemovePages: $scope.FlagRemovePages || 0,
                        flagReturnProduct: $scope.FlagReturnProduct || 0,
                        flagStore: $scope.FlagStore || 0
                    }

                    var postUrl;
                    if($scope._entry == 0){
                        postUrl = "/service/createOrder";
                    }else{
                        postUrl = "/customerBiz/createOrder"
                    }
                    $remote.post(postUrl, postData, function(data){
                        $scope.STEP++;
                    });
                    break;
                case 4:
                    if($scope.PAY_CHANNEL == 0){
                        jQuery("#orderCommit").submit();
                        var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_PAY_SUCCESS, confCallback:function(){
                            $scope.updatePayStatus();
                        }};
                        $scope.showMessage(msg);
                    }else{
                        var postData = {
                            orderId: $scope.orderId,
                            payAmount: $scope.orderTotalAmt
                        }
                        $remote.post("/customerBiz/payOrder", postData, function(data){
                            console.log(data);
                            $scope.STEP++;
                        })
                    }
                    break;
            }
        }

        $scope.preStep = function(){
            $scope.STEP--;
        }
    }]]]
});