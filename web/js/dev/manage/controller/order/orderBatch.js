define(["xlsx"], function(xlsx) {
    return [["OrderBatchCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$config", "$constants", "$upload", "$dict",
        function($scope, $rootScope, $remote, $modal, $scopeData, $config, $constants, $upload, $dict) {

            $scope.getProvincesName();
            $scope.getCitysName();
            $scope.getAreasName();

            console.log(xlsx)

            var orderTemplate = {
                _rowBegin: 2,
                header:[
                    {id: "A", cn:"清关口岸", name: "gateApi", style:"option", list:"天津,深圳"},
                    {id: "B", cn:"清关模式", name: "gateMode", style:"option", list:"行邮,包税"},
                    {id: "C", cn:"订单编号", name: "id", style:"id"},
                    {id: "D", cn:"订单名称", name: "name", style:"empty"},
                    {id: "E", cn:"收件人", name: "receiveName", style:"empty"},
                    {id: "F", cn:"收件省份", name: "receiveProvinceName", style:"province"},
                    {id: "G", cn:"收件城市", name: "receiveCityName", style:"city"},
                    {id: "H", cn:"收件地区", name: "receiveAreaName", style:"area"},
                    {id: "I", cn:"收件地址", name: "receiveAddress", style:"empty"},
                    {id: "J", cn:"收件电话", name: "receivePhone", style:"empty"},
                    {id: "K", cn:"付款人名称", name: "payerName"},
                    {id: "L", cn:"付款人地址", name: "payerAddress"},
                    {id: "M", cn:"付款人电话", name: "payerPhone"},
                    {id: "N", cn:"付款人身份证", name: "payerIdNo", style:"idno"},
                    {id: "O", cn:"商品统称", name: "productName", style:"empty"},
                    {id: "P", cn:"总数量", name: "productNum", style:"number"},
                    {id: "Q", cn:"总价值", name: "productAmount", style:"number"},
                    {id: "R", cn:"总重量", name: "productWeight", style:"number"},
                    {id: "S", cn:"备注", name: "description"}
                ]
            }

            var productTemplate = {
                _rowBegin: 2,
                header:[
                    {id: "A", name: "id", style:"id"},
                    {id: "B", name: "pName", style:"empty"},
                    {id: "C", name: "pBrand", style:"empty"},
                    {id: "D", name: "pNum", style:"number"},
                    {id: "E", name: "pUnit", style:"empty"},
                    {id: "F", name: "pAmount", style:"number"},
                    {id: "G", name: "pTotalAmount", style:"number"},
                    {id: "H", name: "pWeight", style:"number"},
                    {id: "I", name: "pRemark"}
                ]
            }

            $scope.excelTab = 0;

            $scope.changeTab = function(value){
                $scope.excelTab = value;
            }

            $scope.$watch("files", function(){
                if($scope.files){
                    $scope.ProgressBar = null;
                    $scope._excelErr = null;
                    $scope.ordersData = null;
                    $scope.productsData = null;
                    $scope.httpOrders = null;
                    $scope.convert();
                    $scope.excelTab = 0;
                }
            })

            function checkIdNo(code) {
                var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
                var tip = null;
                var pass= true;

                if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                    tip = "身份证身份证号格式错误";
                    pass = false;
                }

                else if(!city[code.substr(0,2)]){
                    tip = "身份证地址编码错误";
                    pass = false;
                }
                else{
                    //18位身份证需要验证最后一位校验位
                    if(code.length == 18){
                        code = code.split('');
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                        //校验位
                        var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                        var sum = 0;
                        var ai = 0;
                        var wi = 0;
                        for (var i = 0; i < 17; i++)
                        {
                            ai = code[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        var last = parity[sum % 11];
                        if(parity[sum % 11] != code[17]){
                            tip = "身份证校验位错误";
                            pass =false;
                        }
                    }
                }
                //if(!pass) alert(tip);
                return pass;
            }

            function checkStyle(header, value){
                var style = header.style;
                var cnName = header.cn;
                if(style){
                    if(style == "empty" || style == "id"){
                        if(!value || value.length == 0){
                            return cnName + "不能为空";
                        }
                    }else if(style == "idno"){
                        if(!checkIdNo(value)){
                            return cnName + "格式不正确";
                        }
                    }else if(style == "option"){
                        var lists = header.list;
                        if(!value || lists.indexOf(value) == -1){
                            return cnName + "取值范围只能为:" + lists;
                        }
                    }else if(style == "number"){
                        var regex = /^[0-9]+.?[0-9]*$/;
                        if (!value || !regex.test(value)){
                            return cnName + "必须为数字类型";
                        }
                    }else if(style == "province"){
                        var mapping = $dict.get("ProvincesName")[value]
                        if(!mapping){
                            return cnName + "不匹配系统省份名称";
                        }
                    }else if(style == "city"){
                        var mapping = $dict.get("CitysName")[value]
                        if(!mapping){
                            return cnName + "不匹配系统城市名称";
                        }
                    }else if(style == "area"){
                        var mapping = $dict.get("AreasName")[value]
                        if(!mapping){
                            return cnName + "不匹配系统区域名称";
                        }
                    }
                }
                return null
            }

            var DEFAULT_ERR = "批量导入文档内容存在错误，请参照提示修复完成后再行提交上传";

            $scope.convert = function(){
                var files = $scope.files;
                var i,f;
                for (i = 0, f = files[i]; i != files.length; ++i) {
                    var reader = new FileReader();
                    var name = f.name;
                    reader.onload = function(e) {
                        var data = e.target.result;
                        var workbook = xlsx.read(data, {type: 'binary'});

                        var reg = /^([a-zA-Z]*)(\d*)$/;

                        var sheet_name_list = workbook.SheetNames;

                        if(sheet_name_list.length != 2){
                            $scope._excelErr = "使用的批量数据模板不符合上传模板格式,请使用正确模板进行数据操作"
                            $scope.$apply();
                            return;
                        }

                        var oData,pData,oIds,oMap,pIds,pMap,oPureData,pPureData;

                        sheet_name_list.forEach(function(sheet_name, index) {
                            var worksheet = workbook.Sheets[sheet_name];
                            var range = worksheet['!ref'].split(':'); // 获取sheet表格的范围
                            var maxRow,maxCol;
                            var template;
                            if(index == 0){
                                template = orderTemplate;
                            }else{
                                template = productTemplate;
                            }
                            var result = reg.exec(range[1]);
                            maxRow = parseInt(result[2]);
                            maxCol = result[1];

                            var startRow = template._rowBegin;
                            var list = [];
                            var pureList = [];
                            var ids = [];
                            var idMap = {};
                            for (var i = startRow; i <= maxRow; i++) {
                                var data = {};
                                var pureData = {};
                                for (var j = 0; j < template.header.length; j++) {
                                    var header = template.header[j];
                                    var cell = header.id + i;
                                    var value = worksheet[cell] ? (worksheet[cell].w + '').trim() : '';
                                    var item = {};
                                    item.error = checkStyle(header, value);
                                    if(item.error && !$scope._excelErr){
                                        $scope._excelErr = DEFAULT_ERR;
                                    }
                                    if(index == 0 && header.id == "A"){
                                        value = $dict.get("GateApiName")[value];
                                    }else if(index == 1 && header.id == "B"){
                                        value = $dict.get("GateModeName")[value];
                                    }
                                    if(header.style && header.style == "id"){
                                        ids.push(value)     //缓存订单号，用于关联判断
                                        idMap[value] = i;
                                    }
                                    item.value = value;
                                    data[header.name] = item;
                                    pureData[header.name] = value;
                                }
                                list.push(data);
                                pureList.push(pureData);
                            }
                            if(index == 0){
                                oIds = ids;
                                oMap = idMap;
                                oData = list;
                                oPureData = pureList;
                            }else{
                                pIds = ids;
                                pMap = idMap;
                                pData = list;
                                pPureData = pureList;
                            }
                        });
                        oIds.forEach(function(each, index){
                            if(!pMap[each]){
                                oData[index]["id"].error = "该订单号未找到对应产品信息,请关联产品信息记录"
                                if(!$scope._excelErr){
                                    $scope._excelErr = DEFAULT_ERR;
                                }
                            }
                        });
                        pIds.forEach(function(each, index){
                            if(!oMap[each]){
                                pData[index]["id"].error = "该订单号未在订单信息表中匹配到对应订单号,请检查订单信息表"
                                if(!$scope._excelErr){
                                    $scope._excelErr = DEFAULT_ERR;
                                }
                            }else{
                                var currentOrder = oPureData[oMap[each] - 2];       //转换excel的startRow为数组起始位置，同时避免!0判断成立
                                if(!(currentOrder.products)){
                                    currentOrder.products = [];
                                }
                                currentOrder.products.push(pPureData[index])
                            }
                        });
                        oPureData.forEach(function(each, index){
                            each.receiveProvince = $dict.get("ProvincesName")[each.receiveProvinceName]
                            each.receiveCity = $dict.get("CitysName")[each.receiveCityName]
                            each.receiveArea = $dict.get("AreasName")[each.receiveAreaName]
                        })
                        $scope.ordersData = oData;
                        $scope.productsData = pData;
                        $scope.httpOrders = oPureData;
                        $scope.$apply();
                    };
                    reader.readAsBinaryString(f);
                }
            }

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
                        $scope.initAreas();
                    });
                }
            }

            $scope.initAreas = function(){
                if($scope.receiveCity){
                    $scope.getAreas($scope.receiveCity.key, function(){
                        var areas = $scope.initOptions("Areas");
                        $scope.AreaList = areas[0];
                        $scope.receiveArea = $scope.AreaList[areas[1]];
                });
            }
            }


            $scope.submitBatch = function(){
                if($scope.httpOrders){
                    var postData = {
                        idBatch: $scope.initJnl("B", 1),
                        creater: $scope.backInfo.loginId,
                        orders: $scope.httpOrders
                    }
                    console.log(postData)
                    $remote.post("/orderBatch/batchImport", postData, function(data){
                        console.log(data);
                    });
                }
            }

            $scope.processExcel = function(data){
                if(data){
                    var postData = data;
                    $remote.post("/orderBatch/processExcel", postData, function(data){
                        //文档内容校验
                        if(data[0]&&data[1]){
                            //$scope.ordersData = [];
                            var ordersData = data[0].data;
                            if(ordersData && ordersData.length > 1){
                                ordersData = ordersData.slice(1);
                            }

                            var productsData = data[1].data;
                            if(productsData && productsData.length > 1) {
                                productsData = productsData.slice(1);
                            }
                            $scope.ordersData = ordersData;
                            $scope.productsData = productsData;
                            $scope.isUploaded = true;
                        }else{
                            var msg = {text:$constants.MESSAGE_FILE_EXCEL_CONTENT_ERROR};
                            $scope.showMessage(msg);
                        }
                    });
                }else{
                    var msg = {text:$constants.MESSAGE_FILE_MUST_UPLOADED};
                    $scope.showMessage(msg);
                }
            }

            $scope.commitExcel = function(data){
                var postData = {
                    file:  data.file,
                    creater: $scope.backInfo.loginId,
                    idBatch: $scope.batchId
                }

                $remote.post("/orderBatch/commitExcel", postData, function(data){
                    var msg = {text:$constants.MESSAGE_FILE_EXCEL_COMMIT_SUCCESS};
                    $scope.showMessage(msg);
                    $scope.isUploaded = false;
                });
            }

            $scope.upload = function () {
                $scope.batchId = "B" + new Date().format("yyyyMMddhhmmssS");
                var files = $scope.files
                $scope.files = null;
                $scope.ProgressBar = {};
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        if(file.size > $config.maxFileSize){
                            var msg = {text:$constants.MESSAGE_FILE_TOO_BIG};
                            $scope.showMessage(msg);
                        }else if(file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
                            var msg = {text:$constants.MESSAGE_FILE_ONLY_XLSX};
                            $scope.showMessage(msg);
                        }else{
                            $upload.upload({
                                url: '/service/upload?type=2&file=' + $scope.batchId,
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.ProgressBar.dynamic = progressPercentage;
                            }).success(function (data, status, headers, config) {
                                $scope.ProgressBar.dynamic = 100;
                                //$scope.processExcel(data);
                                $scope.commitExcel(data);
                            });
                        }
                    }
                }
            };
        }]
    ]];
});