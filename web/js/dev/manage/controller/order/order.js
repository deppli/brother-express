define(["thenjs", "excel-builder", "downloadify", "bootstrap-icheck"], function(then, excelBuilder, downloader) {
    return [["OrderCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$config", "$constants",
        function($scope, $rootScope, $remote, $modal, $scopeData, $config, $constants) {
            $scope.payerIdType = "身份证";
            $scope._Query = {}
            $scope._Query.begindate = new Date().format("yyyyMMdd");
            $scope._Query.enddate = new Date().format("yyyyMMdd");

            var status = $scope.initOptions("OrderStatus");
            $scope.QueryOrderStatus = status[0];

            var types = $scope.initOptions("OrderType");
            $scope.QueryOrderType = types[0];

            var kinds = $scope.initOptions("PayStatus");
            $scope.QueryOrderPayStatus = kinds[0];

            $scope.TimeList = [
                {key:1, value: '1天'},
                {key:3, value: '3天'},
                {key:7, value: '7天'},
                {key:30, value: '30天'},
                {key:90, value: '90天'},
                {key:180, value: '180天'},
                {key:365, value: '365天'}
            ];

            $scope.resetQuery = function(){
                $rootScope.Query = {};
            }

            $scope.resetQuery();

            $scope.initPageQuery = function(){
                var postData = {};
                postData.idBatch = $scope.Query.idBatch||null
                postData.id = $scope.Query.id||null
                postData.receiveName = $scope.Query.receiveName||null
                if($scope.Query.type){
                    postData.type = $scope.Query.type.key
                }
                if($scope.Query.status){
                    postData.status = $scope.Query.status.key
                }
                if($scope.Query.payStatus){
                    postData.payStatus = $scope.Query.payStatus.key
                }
                if($scope.Query.time){
                    if($scope.Query.time == -1){
                        var begin = $scope.checkDate($scope._Query.begindate);
                        var end = $scope.checkDate($scope._Query.enddate);
                        if(!begin || !end){
                            var msg = {text:$constants.MESSAGE_DATE_FORMAT_ERROR};
                            $scope.showMessage(msg);
                            return false;
                        }
                        postData.time = -1;
                        postData.timeBegin = begin;
                        postData.timeEnd = end;
                    }else{
                    postData.time = $scope.Query.time.key
                }
                }
                return postData;
            }

            $scope.batchPrint = function(){
                var postData = $scope.initPageQuery();

                //先进行打印数量查询，确保一次性打印笔数过多造成前端假死或崩溃
                $remote.post("/order/count", postData, function(data){
                    console.log(data)
                    if(data && data > 200){
                        var msg = {text: $constants.MESSAGE_PRINT_BATCH_LIMITED}
                        $scope.showMessage(msg);
                        return;
                    }
                $remote.post("/order/list", postData, function(data){
                    var iframe = document.getElementById("printPage");
                    iframe.contentWindow.focus();
                    iframe.contentWindow.doSettingValues(data);
                    iframe.contentWindow.print();
                })
                })

            }

            $scope.printOrder = function(){
                if($scope.selectedOrder){
                    var postData = {
                        id: $scope.selectedOrder.id
                    }
                    $scope.selectCancel();
                    $remote.post("/order/detail", postData, function(data){
                        var orders = [];
                        orders.push(data)
                        var iframe = document.getElementById("printPage");
                        iframe.contentWindow.focus();
                        iframe.contentWindow.doSettingValues(orders);
                        iframe.contentWindow.print();
                        //console.log(iframe.contentWindow.Order);
                    });
                }
            }

            $scope.getExchange = function(){
                var postData = {
                    paramsId: "0A001"
                }

                $remote.post("/service/getSettings", postData, function(data){
                    $scope._exchange = data.paramsValue;
                }, function(){
                    var msg = {text:$constants.MESSAGE_FILE_EXCEL_EXCHANGE_EMPTY};
                    $scope.showMessage(msg);
                });
            }
            $scope.getExchange();

            $scope.currentPage = 1;
            $scope.maxSize = 5;
            $scope.pageSize = 15;

            $scope.batchDeleteOrder = function(){
                var postData = $scope.initPageQuery();
                if(!postData){
                    return
                }

                var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_DEL_ORDER, confCallback:function(){
                    $remote.post("/order/batchDelete", postData, function(data){
                        $scope.listOrder(true);
                        $scope.selectedOrder = null;
                    })
                }};
                $scope.showMessage(msg);

            }

            $scope.selectCancel = function(){
                $scope.selectedOrder = null;
            }

            $scope.listOrder = function(init){
                $scope.selectCancel();
                var postData = $scope.initPageQuery();
                if(!postData){
                    return
                }

                $remote.post("/order/count", postData, function(data){
                    $scope.totalItems = data;

                    if(init){
                        postData.currentPage = 1;
                        postData.pageSize = 15;
                    }else{
                        postData.currentPage = $scope.currentPage;
                        postData.pageSize = $scope.pageSize;
                    }

                    $remote.post("/order/list", postData, function(data){
                        $scope.OrderList = data;
                    })
                });

            }

            $scope.listOrder(true);

            $scope.pageChanged = function() {
                $scope.listOrder();
            };

            $scope.selectOrder = function(item, index){
                if($scope.selectedOrder){
                    if($scope.selectedOrder.index == index){
                        $scope.selectedOrder = null;
                    }else{
                        $scope.selectedOrder = item;
                        $scope.selectedOrder.index = index;
                    }
                }else{
                    $scope.selectedOrder = item;
                    $scope.selectedOrder.index = index;
                }
            }

            $scope.exportsModal = function(){
                var modalDetail = $modal.open({
                    templateUrl: 'exports',
                    controller: 'ExportsCtrl',
                    size: "sm",
                    //backdrop: 'static',
                    scope: $scope
                });
            }

            $scope.detailOrder = function(){
                if($scope.selectedOrder){
                    var postData = {
                        id: $scope.selectedOrder.id
                    }
                    $scope.selectCancel();

                    $remote.post("/order/detail", postData, function(data){
                        $scope.Order = data;
                        $scope.detailModal();
                    });
                }
            }

            $scope.pathOrder = function(){
                if($scope.selectedOrder){
                    var postData = {
                        id: $scope.selectedOrder.id
                    }
                    $scope.selectCancel();

                    $remote.post("/order/detail", postData, function(data){
                        $scope.Order = data;
                        $scope.pathModal();
                    });
                }
            }

            $scope.deleteOrder = function(){
                if($scope.selectedOrder){
                    var postData = {
                        id: $scope.selectedOrder._id
                    }
                    $scope.selectCancel();
                    var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_DEL_ORDER, confCallback:function(){
                        $remote.post("/order/delete", postData, function(data){
                            $scope.listOrder();
                            $scope.selectedOrder = null;
                        });
                    }};
                    $scope.showMessage(msg);
                }
            }

            $scope.newModal = function(){
                var modalNew = $modal.open({
                    templateUrl: 'addOrder',
                    controller: 'NewOrderCtrl',
                    size: "lg",
                    backdrop: 'static',
                    scope: $scope
                });
            }

            $scope.detailModal = function(){
                var modalDetail = $modal.open({
                    templateUrl: 'editOrder',
                    controller: 'EditOrderCtrl',
                    size: "lg",
                    backdrop: 'static',
                    scope: $scope
                });
            }

            $scope.pathModal = function(){
                var modalDetail = $modal.open({
                    templateUrl: 'pathOrder',
                    controller: 'PathOrderCtrl',
                    size: "lg",
                    backdrop: 'static',
                    scope: $scope
                });
            }

        }]
    ],["ExportsCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config", "$constants",
        function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config, $constants) {

            var exportedExcel = excelBuilder.createWorkbook();
            var stylesheet = exportedExcel.getStyleSheet();

                var boldDXF = stylesheet.createDifferentialStyle({
                    font: {
                        italic: true
                    }
                });

                //Excel表头样式
                var header = stylesheet.createFormat({
                    font: {
                        size: 10,
                        bold: true,
                        color: '000000'
                    },
                    fill: {
                        type: 'pattern',
                        patternType: 'solid',
                        fgColor: '83c6e8'
                    }
                });

                //Excel数据样式
                var border = "A3A3A3";
                var bodyer = stylesheet.createFormat({
                    font: {
                        size: 10,
                        bold: false,
                        color: '3A3A3A'
                    },
                    fill: {
                        type: 'pattern',
                        patternType: 'solid'
                    },
                    border: {
                        bottom: {color: border, style: 'thin'},
                        top: {color: border, style: 'thin'},
                        left: {color: border, style: 'thin'},
                        right: {color: border, style: 'thin'}
                    }
                });

            //根据数据生成深圳[行邮]Excel文件
            $scope.exportExcel = function(){
                    if(!$scope._exchange){
                        var msg = {text:$constants.MESSAGE_FILE_EXCEL_EXCHANGE_EMPTY};
                        $scope.showMessage(msg);
                        return;
                    }
                    var _exchange = $scope._exchange;

                    var albumList = exportedExcel.createWorksheet({name: '行邮数据'});

                    albumList.setRowInstructions(1, {height: 30, style: boldDXF.id});

                //数据体，预先准备数据头
                var excelData = [
                    [
                        {value:'订单编号', metadata: {style: header.id}},
                        {value:'发件人', metadata: {style: header.id}},
                        {value:'发件人地址', metadata: {style: header.id}},
                        {value:'发件人电话', metadata: {style: header.id}},
                        {value:'收件人', metadata: {style: header.id}},
                        {value:'收件人电话', metadata: {style: header.id}},
                        {value:'收件人城市', metadata: {style: header.id}},
                        {value:'收件人邮编', metadata: {style: header.id}},
                        {value:'收件人地址', metadata: {style: header.id}},
                        {value:'订单名称', metadata: {style: header.id}},
                        {value:'订单商品数量', metadata: {style: header.id}},
                        {value:'订单商品价值', metadata: {style: header.id}},
                        {value:'订单商品重量', metadata: {style: header.id}},
                        {value:'税号', metadata: {style: header.id}},
                        {value:'商品名称', metadata: {style: header.id}},
                        {value:'商品品牌', metadata: {style: header.id}},
                        {value:'商品数量', metadata: {style: header.id}},
                        {value:'单位', metadata: {style: header.id}},
                        {value:'价值', metadata: {style: header.id}},
                        {value:'币种', metadata: {style: header.id}},
                        {value:'证件号码', metadata: {style: header.id}}
                    ]
                ];


                var seq = 0;
                    var postData = $scope.initPageQuery();
                    if(!postData){
                        return
                }
                    postData.gateMode = 0         //行邮
                    postData.gateApi = 0
                //遍历后端返回数据，解析原有[{key1:value1,key2:value2}]形式为[value,value]
                $remote.post("/order/list", postData, function(orders){
                    orders.forEach(function(order){
                            if(order.products && order.products.length > 0){
                            order.products.forEach(function(product){
                                var row = [];
                                /*var seqCol = {metadata: {style: bodyer.id}};
                                 seqCol.value = seq++;
                                 row.push(seqCol);*/
                                row.push({value: order.id||"", metadata: {style: bodyer.id}});
                                row.push({value: order.sendName||"", metadata: {style: bodyer.id}});
                                row.push({value: order.sendAddress||"", metadata: {style: bodyer.id}});
                                row.push({value: order.sendPhone||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receiveName||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receivePhone||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receiveCityName||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receiveZipCode||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receiveAddress||"", metadata: {style: bodyer.id}});
                                    row.push({value: order.productName||"", metadata: {style: bodyer.id}});
                                row.push({value: order.productNum||0, metadata: {style: bodyer.id}});
                                    row.push({value: order.productAmount||"获取失败", metadata: {style: bodyer.id}});
                                row.push({value: order.productWeight||0, metadata: {style: bodyer.id}});
                                row.push({value: "", metadata: {style: bodyer.id}});
                                    var unit = product.pUnit||"";
                                    row.push({value: product.pName + " " + product.pNum + unit, metadata: {style: bodyer.id}});
                                row.push({value: product.pBrand||"", metadata: {style: bodyer.id}});
                                row.push({value: product.pNum||0, metadata: {style: bodyer.id}});
                                row.push({value: product.pUnit||"", metadata: {style: bodyer.id}});
                                    row.push({value: product.pTotalAmount||"获取失败", metadata: {style: bodyer.id}});
                                    row.push({value: "502"||"", metadata: {style: bodyer.id}});
                                row.push({value: order.payerIdNo||"", metadata: {style: bodyer.id}});
                                excelData.push(row);
                            });
                        }
                    });

                    albumList.setData(excelData); //<-- Here's the important part

                        exportedExcel.addWorksheet(albumList);

                        var data = excelBuilder.createFile(exportedExcel);

                    //var file = new Date().format("yyyyMMddhhmmssS") + '-' + $constants.NAME_EXPORT_ORDER_EXCEL_TYPEA_NAME;
                    var file = $constants.NAME_EXPORT_ORDER_EXCEL_TYPEA_NAME;
                    $scope.download(data, file);
                })
                $modalInstance.close();
            }

            //根据数据生成深圳[包税]Excel文件
            $scope.exportExcelBS = function(){
                    var albumList = exportedExcel.createWorksheet({name: '包税数据'});

                albumList.setRowInstructions(1, {
                    height: 30,
                    style: boldDXF.id
                });

                //数据体，预先准备数据头
                var excelData = [
                    [
                        {value:'序号', metadata: {style: header.id}},
                        {value:'订单编号', metadata: {style: header.id}},
                        {value:'商品名称', metadata: {style: header.id}},
                        {value:'商品品牌', metadata: {style: header.id}},
                            //{value:'商品数量', metadata: {style: header.id}},
                            //{value:'单位', metadata: {style: header.id}},
                            {value:'重量(kg)', metadata: {style: header.id}},
                        {value:'商品价值(元)', metadata: {style: header.id}},
                        {value:'收件人', metadata: {style: header.id}},
                        {value:'收件人地址', metadata: {style: header.id}},
                        {value:'收件人电话', metadata: {style: header.id}},
                        {value:'备注', metadata: {style: header.id}}
                    ]
                ];

                    var seq = 1;
                    var postData = $scope.initPageQuery();
                    if(!postData){
                        return
                    }
                    postData.gateMode = 1         //包税
                    postData.gateApi = 0
                //遍历后端返回数据，解析原有[{key1:value1,key2:value2}]形式为[value,value]
                $remote.post("/order/list", postData, function(orders) {
                    orders.forEach(function(order){
                            if(order.products && order.products.length > 0){
                                var productName = "";
                                var productBrand = ""
                                order.products.forEach(function(product, index){
                                    var suffix = "/";
                                    if(index + 1 == order.products.length){
                                        suffix = "";
                                    }
                                    productName += (product.pName + product.pNum + suffix);
                                    productBrand += (product.pBrand  + suffix);
                                });
                                var row = [];
                                var seqCol = {metadata: {style: bodyer.id}};
                                seqCol.value = seq++;
                                row.push(seqCol);
                                row.push({value: order.id||"", metadata: {style: bodyer.id}});
                                row.push({value: productName||"", metadata: {style: bodyer.id}});
                                row.push({value: productBrand||"", metadata: {style: bodyer.id}});
                                row.push({value: order.productWeight||"", metadata: {style: bodyer.id}});
                                row.push({value: order.productAmount||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receiveName||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receiveAddress||"", metadata: {style: bodyer.id}});
                                row.push({value: order.receivePhone||"", metadata: {style: bodyer.id}});
                                row.push({value: "", metadata: {style: bodyer.id}});
                                excelData.push(row);
                        }
                    });

                    albumList.setData(excelData); //<-- Here's the important part

                        exportedExcel.addWorksheet(albumList);

                        var data = excelBuilder.createFile(exportedExcel);

                    var file = $constants.NAME_EXPORT_ORDER_EXCEL_TYPEB_NAME;
                    $scope.download(data, file);
                });

                $modalInstance.close();
            }

            //根据数据生成天津宜信清关Excel文件
            $scope.exportExcelTJ = function(){
                var orders = exportedExcel.createWorksheet({name: '分运单'});
                var products = exportedExcel.createWorksheet({name: '分运单内件'});

                orders.setRowInstructions(1, {height: 30,style: boldDXF.id});

                //数据体，预先准备数据头
                var orderData = [
                    [
                        {value:'仓库', metadata: {style: header.id}},
                        {value:'口岸', metadata: {style: header.id}},
                        {value:'客户内单号', metadata: {style: header.id}},
                        {value:'托盘号', metadata: {style: header.id}},
                        {value:'重量(kg)', metadata: {style: header.id}},
                        {value:'发货人姓名', metadata: {style: header.id}},
                        {value:'发货人地址', metadata: {style: header.id}},
                        {value:'发货人电话', metadata: {style: header.id}},
                        {value:'原寄地', metadata: {style: header.id}},
                        {value:'收件人姓名', metadata: {style: header.id}},
                        {value:'身份证', metadata: {style: header.id}},
                        {value:'省份', metadata: {style: header.id}},
                        {value:'城市', metadata: {style: header.id}},
                        {value:'区/县', metadata: {style: header.id}},
                        {value:'收件人地址', metadata: {style: header.id}},
                        {value:'收件人电话', metadata: {style: header.id}},
                        {value:'邮编', metadata: {style: header.id}}
                    ]
                ];

                //数据体，预先准备数据头
                var productData = [
                    [
                        {value:'客户内单号', metadata: {style: header.id}},
                        {value:'行邮税号', metadata: {style: header.id}},
                        {value:'物品名称', metadata: {style: header.id}},
                        {value:'规格', metadata: {style: header.id}},
                        {value:'品牌', metadata: {style: header.id}},
                        {value:'申报单价', metadata: {style: header.id}},
                        {value:'数量', metadata: {style: header.id}},
                        {value:'单位', metadata: {style: header.id}},
                        {value:'币种', metadata: {style: header.id}},
                        {value:'物品总净重', metadata: {style: header.id}},
                    ]
                ];


                var seq = 0;
                var postData = $scope.initPageQuery();
                if(!postData){
                    return
                }
                //postData.gateMode = 0         //行邮
                postData.gateApi = 1
                //遍历后端返回数据，解析原有[{key1:value1,key2:value2}]形式为[value,value]
                $remote.post("/order/list", postData, function(items){
                    items.forEach(function(order){
                        var row = [];
                        row.push({value: "仲良快递纽约", metadata: {style: bodyer.id}});
                        row.push({value: "天津", metadata: {style: bodyer.id}});
                        row.push({value: order.id||"", metadata: {style: bodyer.id}});
                        row.push({value: "", metadata: {style: bodyer.id}});
                        row.push({value: order.productWeight||"", metadata: {style: bodyer.id}});
                        row.push({value: "仲良速递", metadata: {style: bodyer.id}});
                        row.push({value: "1507 College Point Blvd", metadata: {style: bodyer.id}});
                        row.push({value: "7183530343", metadata: {style: bodyer.id}});
                        row.push({value: "纽约", metadata: {style: bodyer.id}});
                        row.push({value: order.receiveName||"", metadata: {style: bodyer.id}});
                        row.push({value: order.payerIdNo||"", metadata: {style: bodyer.id}});
                        row.push({value: order.receiveProvinceName||"", metadata: {style: bodyer.id}});
                        row.push({value: order.receiveCityName||"", metadata: {style: bodyer.id}});
                        row.push({value: order.receiveAreaName||"", metadata: {style: bodyer.id}});
                        row.push({value: order.receiveAddress||"", metadata: {style: bodyer.id}});
                        row.push({value: order.receivePhone||"", metadata: {style: bodyer.id}});
                        row.push({value: order.receiveZipCode||"", metadata: {style: bodyer.id}});
                        orderData.push(row);

                        if(order.products && order.products.length > 0){
                            order.products.forEach(function(product){
                                var row = [];
                                row.push({value: order.id||"", metadata: {style: bodyer.id}});
                                row.push({value: "", metadata: {style: bodyer.id}});
                                row.push({value: product.pName||"", metadata: {style: bodyer.id}});
                                row.push({value: product.pUnit||"", metadata: {style: bodyer.id}});
                                row.push({value: product.pBrand||"", metadata: {style: bodyer.id}});
                                row.push({value: product.pAmount||"", metadata: {style: bodyer.id}});
                                row.push({value: product.pNum||"", metadata: {style: bodyer.id}});
                                row.push({value: product.pUnit||"", metadata: {style: bodyer.id}});
                                row.push({value: "RMB", metadata: {style: bodyer.id}});
                                row.push({value: product.pWeight||"", metadata: {style: bodyer.id}});
                                productData.push(row);
                            });
                        }
                    });
                    orders.setData(orderData);
                    exportedExcel.addWorksheet(orders);

                    products.setData(productData);
                    exportedExcel.addWorksheet(products);

                    var data = excelBuilder.createFile(exportedExcel);

                    var file = $constants.NAME_EXPORT_ORDER_EXCEL_TJ_NAME;
                    $scope.download(data, file);
                })
                $modalInstance.close();
            }

            $scope.download = function(data, fileName){
                Downloadify.create('downloader',{
                    filename: function(){
                        return fileName;
                    },
                    data: data,
                    onComplete: function(){
                        $("#downloader").hide();
                    },
                    //onCancel: function(){ alert('You have cancelled the saving of this file.'); },
                    onError: function(){
                        alert("文件保存失败!");
                    },
                    swf: 'js/dev/lib/downloadify/media/downloadify.swf',
                    downloadImage: 'js/dev/lib/downloadify/images/excel2.png',
                    width: 30,
                    dataType: 'base64',
                    height: 37.5,
                    transparent: true,
                    append: false
                });
                $("#downloader").show();
            }
        }]
    ],["NewOrderCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config", "$constants",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config, $constants) {
                $scope.products = [];

                $scope.$watch(function(){
                    var totalNum = 0;
                    var totalAmount = 0;
                    var totalWeight = 0;
                    $scope.products.forEach(function(each){
                        totalNum += each.pNum;
                        totalAmount += each.pTotalAmount;
                        totalWeight += each.pWeight;
                    })
                    if(totalNum){
                        $scope.productNum = totalNum;
                    }
                    if(totalAmount){
                    $scope.productAmount = Math.round(totalAmount * 100) * 0.01
                    }
                    if(totalWeight){
                    $scope.productWeight = Math.round(totalWeight * 100) * 0.01
                    }
                    $scope.amount = $scope.transportAmount + $scope.taxAmount + $scope.safeAmount + $scope.otherAmount;
                $scope.amount = Math.round($scope.amount * 100) * 0.01
                })

                var isOrNotOptions = $scope.initOptions("IsOrNot");
                $scope.isOrNot = isOrNotOptions[0];
                $scope.isFixed = $scope.isOrNot[0];
                $scope.isFast = $scope.isOrNot[0];
                $scope.isProtected = $scope.isOrNot[0];
                $scope.flagBox = $scope.isOrNot[0];
                $scope.flagDetailProduct = $scope.isOrNot[0];
                $scope.flagReturnProduct = $scope.isOrNot[0];
                $scope.flagElec = $scope.isOrNot[0];
                $scope.flagRemovePages = $scope.isOrNot[0];

                var StorePeriod = $scope.initOptions("StorePeriod");
                $scope.StorePeriod = StorePeriod[0];
                $scope.flagStore = $scope.StorePeriod[0]

                var gateMode = $scope.initOptions("GateMode");
                $scope.GateModeList = gateMode[0];
                $scope.gateMode = $scope.GateModeList[0];

            $scope.GateApiList = $scope.initOptions("GateApi");
            $scope.gateApi = $scope.GateApiList[0];

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

                $scope.addProduct = function(){
                    $scope.products.push({});
                }

                $scope.removeProduct = function(index){
                    $scope.products.splice(index,1);
                }

                var nowTime = new Date();

                $scope.orderId = $scope.initJnl("S");
                $scope.worldTransId = $scope.orderId;
                $scope.worldTransName = $constants.NAME_COMPANY_NAME;
                $scope.sendName = $constants.NAME_COMPANY_NAME;
            $scope.sendPhone = $constants.NAME_COMPANY_TELPHONE;
            $scope.sendAddress = $constants.NAME_COMPANY_ADDRESS;

                $scope.newOrder = function(){
                    if(!$scope.products || $scope.products.length == 0){
                        var msg = {text:$constants.MESSAGE_FORM_PRODUCTS_MUST_EXIST};
                        $scope.showMessage(msg);
                        return;
                    }

                    if($scope.checkForm($scope.addOrderForm)){
                        var postData = {
                            id: $scope.orderId,
                            //type: $constants.TYPE_ORDER_SINGLE,        //后台新建订单
                            name: $scope.orderName,
                            description: $scope.orderDescription,
                            creater: $rootScope.backInfo.loginId || "",
                        gateApi: $scope.gateApi.key||0,
                            gateMode: $scope.gateMode.key || 0,
                            amount: $scope.amount || 0,
                            worldTransId: $scope.worldTransId || "",
                            worldTransName: $scope.worldTransName || "",
                            chinaTransId: $scope.chinaTransId || "",
                            chinaTransName: $scope.chinaTransName || "",
                            payerName: $scope.payerName || "",
                            payerPhone: $scope.payerPhone || "",
                            payerIdType: $scope.payerIdType || "",
                            payerIdNo: $scope.payerIdNo || "",
                            payerAddress: $scope.payerAddress || "",
                            payerZipCode: $scope.payerZipCode || "",
                            sendName: $scope.sendName || "",
                            sendAddress: $scope.sendAddress || "",
                            sendPhone: $scope.sendPhone || "",
                            receiveName: $scope.receiveName || "",
                            receiveProvince: $scope.receiveProvince.key || "",
                            receiveProvinceName: $scope.receiveProvince.value || "",
                            receiveCity: $scope.receiveCity.key || "",
                            receiveCityName: $scope.receiveCity.value || "",
                        receiveArea: $scope.receiveArea.key || "",
                        receiveAreaName: $scope.receiveArea.value || "",
                            receiveAddress: $scope.receiveAddress || "",
                            receivePhone: $scope.receivePhone || "",
                            receiveZipCode: $scope.receiveZipCode || "",
                            productName: $scope.productName || "",
                            productNum: $scope.productNum || 0,
                            productAmount: $scope.productAmount || 0,
                            productWeight: $scope.productWeight || 0,
                            products: $scope.products||[],          //产品列表
                            transportAmount: $scope.transportAmount || 0,
                            taxAmount: $scope.taxAmount || 0,
                            safeAmount: $scope.safeAmount || 0,
                            otherAmount: $scope.otherAmount || 0,
                            isFixed: $scope.isFixed.key || 0,
                            isFast: $scope.isFast.key || 0,
                            isProtected: $scope.isProtected.key || 0,
                            flagBox: $scope.flagBox.key||0,
                            flagDetailProduct: $scope.flagDetailProduct.key||0,
                            flagElec: $scope.flagElec.key||0,
                            flagRemovePages: $scope.flagRemovePages.key||0,
                            flagReturnProduct: $scope.flagReturnProduct.key||0,
                            flagStore: $scope.flagStore.key||0
                        }

                        $remote.post("/order/add", postData, function(data){
                            $modalInstance.close();
                            var msg = {text:$constants.MESSAGE_SUCCESS_NEW_ORDER};
                            $scope.showMessage(msg);
                            $scope.listOrder();
                        });
                    }
                }
            }]
        ],
        ["EditOrderCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config", "$constants",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config, $constants) {
                if(!$scope.Order.products){
                    $scope.Order.products = [];
                }

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.$watch(function(){
                    var totalNum = 0;
                    var totalAmount = 0;
                    var totalWeight = 0;
                    $scope.Order.products.forEach(function(each){
                        totalNum += each.pNum;
                        totalAmount += each.pTotalAmount;
                        totalWeight += each.pWeight;
                    })
                    if(totalNum){
                        $scope.Order.productNum = totalNum;
                    }
                    if(totalAmount){
                    $scope.Order.productAmount = Math.round(totalAmount * 100) * 0.01
                    }
                    if(totalWeight){
                    $scope.Order.productWeight = Math.round(totalWeight * 100) * 0.01
                    }
                    $scope.Order.amount = $scope.Order.transportAmount + $scope.Order.taxAmount + $scope.Order.safeAmount + $scope.Order.otherAmount;
                $scope.Order.amount = Math.round($scope.Order.amount * 100) * 0.01
                })

                var gateMode = $scope.initOptions("GateMode", $scope.Order.gateMode);
                $scope.GateModeList = gateMode[0];
                $scope.Order.gateMode = $scope.GateModeList[gateMode[1]];

            var gateApi = $scope.initOptions("GateApi", $scope.Order.gateApi);
            $scope.GateApiList = gateApi[0];
            $scope.Order.gateApi = $scope.GateApiList[gateApi[1]];

                $scope.getProvinces(function(){
                    var provinces = $scope.initOptions("Provinces", $scope.Order.receiveProvince);
                    $scope.ProvinceList = provinces[0];
                    $scope.Order.receiveProvince = $scope.ProvinceList[provinces[1]];
                    $scope.initCitys($scope.Order.receiveCity);
                });

                $scope.initCitys = function(defaultValue){
                    if($scope.Order.receiveProvince){
                        $scope.getCitys($scope.Order.receiveProvince.key, function(){
                            var citys = $scope.initOptions("Citys", defaultValue);
                            $scope.CityList = citys[0];
                            $scope.Order.receiveCity = $scope.CityList[citys[1]];
                        $scope.initAreas($scope.Order.receiveArea);
                    });
                }
            }

            $scope.initAreas = function(defaultValue){
                if($scope.Order.receiveCity){
                    $scope.getAreas($scope.Order.receiveCity.key, function(){
                        var areas = $scope.initOptions("Areas", defaultValue);
                        $scope.AreaList = areas[0];
                        $scope.Order.receiveArea = $scope.AreaList[areas[1]];
                        });
                    }
                }

                $scope.addProduct = function(){
                    $scope.Order.products.push({});
                }

                $scope.removeProduct = function(index){
                    $scope.Order.products.splice(index,1);
                }

                var isOrNotOptions = $scope.initOptions("IsOrNot");
                $scope.isOrNot = isOrNotOptions[0];

                $scope.initYNRadios = function(param){
                    if($scope.Order[param] && $scope.Order[param] == "1"){
                        $scope.Order[param] = $scope.isOrNot[1];
                }else{
                        $scope.Order[param] = $scope.isOrNot[0];
                }
                }
                $scope.initYNRadios("isFixed");
                $scope.initYNRadios("isFast");
                $scope.initYNRadios("isProtected");
                $scope.initYNRadios("flagBox");
                $scope.initYNRadios("flagDetailProduct");
                $scope.initYNRadios("flagReturnProduct");
                $scope.initYNRadios("flagElec");
                $scope.initYNRadios("flagRemovePages");
                var result = $scope.initOptions("StorePeriod", $scope.Order.flagStore);
                $scope.StorePeriod = result[0];
                $scope.Order.flagStore = $scope.StorePeriod[result[1]];

                var result = $scope.initOptions("OrderStatus", $scope.Order.status);
                $scope.OrderStatusList = result[0];
                $scope.Order.status = $scope.OrderStatusList[result[1]];

                $scope.editOrder = function(){
                    if(!$scope.Order.products || $scope.Order.products.length == 0){
                        var msg = {text:$constants.MESSAGE_FORM_PRODUCTS_MUST_EXIST};
                        $scope.showMessage(msg);
                        return;
                    }

                    if($scope.checkForm($scope.editOrderForm)) {
                        var postData = {
                            idBatch: $scope.Order.idBatch || "",
                            dbId: $scope.Order._id,
                            idGate: $scope.Order.idGate || "",
                        gateApi: $scope.Order.gateApi.key||0,
                            gateMode: $scope.Order.gateMode.key || 0,
                            name: $scope.Order.name || "",
                            description: $scope.Order.description,
                            createTime: $scope.Order.createTime,
                            status:  $scope.Order.status.key,
                            updateInfo: $scope.Order.updateInfo,
                            amount: $scope.Order.amount || 0,
                            worldTransId: $scope.Order.worldTransId || "",
                            worldTransName: $scope.Order.worldTransName || "",
                            chinaTransId: $scope.Order.chinaTransId || "",
                            chinaTransName: $scope.Order.chinaTransName || "",
                            payerName: $scope.Order.payerName || "",
                            payerPhone: $scope.Order.payerPhone || "",
                            payerIdType: $scope.Order.payerIdType || "",
                            payerIdNo: $scope.Order.payerIdNo || "",
                            payerAddress: $scope.Order.payerAddress || "",
                            payerZipCode: $scope.Order.payerZipCode || "",
                            sendName: $scope.Order.sendName || "",
                            sendAddress: $scope.Order.sendAddress || "",
                            sendPhone: $scope.Order.sendPhone || "",
                            receiveName: $scope.Order.receiveName || "",
                            receiveProvince: $scope.Order.receiveProvince.key || "",
                            receiveProvinceName: $scope.Order.receiveProvince.value || "",
                            receiveCity: $scope.Order.receiveCity.key || "",
                            receiveCityName: $scope.Order.receiveCity.value || "",
                        receiveArea: $scope.Order.receiveArea.key || "",
                        receiveAreaName: $scope.Order.receiveArea.value || "",
                            receiveAddress: $scope.Order.receiveAddress || "",
                            receivePhone: $scope.Order.receivePhone || "",
                            receiveZipCode: $scope.Order.receiveZipCode || "",
                            productName: $scope.Order.productName || "",
                            productNum: $scope.Order.productNum || 0,
                            productAmount: $scope.Order.productAmount || 0,
                            productWeight: $scope.Order.productWeight || 0,
                            products: $scope.Order.products||[],          //产品列表
                            transportAmount: $scope.Order.transportAmount || 0,
                            taxAmount: $scope.Order.taxAmount || 0,
                            safeAmount: $scope.Order.safeAmount || 0,
                            otherAmount: $scope.Order.otherAmount || 0,
                            isFixed: $scope.Order.isFixed.key || 0,
                            isFast: $scope.Order.isFast.key || 0,
                            isProtected: $scope.Order.isProtected.key || 0,
                            flagBox: $scope.Order.flagBox.key||0,
                            flagDetailProduct: $scope.Order.flagDetailProduct.key||0,
                            flagElec: $scope.Order.flagElec.key||0,
                            flagRemovePages: $scope.Order.flagRemovePages.key||0,
                            flagReturnProduct: $scope.Order.flagReturnProduct.key||0,
                            flagStore: $scope.Order.flagStore.key||0
                        }
                        $remote.post("/order/edit", postData, function(data){
                            $modalInstance.close();
                            $scope.listOrder();
                        });
                        //$modalInstance.close();
                    }
                }
            }]
        ],["PathOrderCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config", "$constants",
        function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config, $constants) {
            var result = $scope.initOptions("OrderStatus", $scope.Order.status);
            $scope.OrderStatusList = result[0];
            $scope.Order.status = $scope.OrderStatusList[result[1]];
            $scope.UpdateMethod = 0;
            $scope.method1 = 0;
            $scope.method2 = 1;

            if(!$scope.Order.updateInfo){
                $scope.Order.updateInfo = [];
            }

            $scope.Order.updateInfo.forEach(function(each){
                each.status = $scope.OrderStatusList[each.status];
            })

            $scope.opened = [];
            $scope.open = function($event, index) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened[index] = true;
            };

            $scope.addPath = function(){
                var data = {
                    updater:$rootScope.backInfo.loginId,
                    time: Date.now(),
                    status: $scope.OrderStatusList[0]
                }

                $scope.Order.updateInfo.push(data);
            }

            $scope.removePath = function(index){
                $scope.Order.updateInfo.splice(index,1);
            }

            $scope.updatePath = function(){
                $scope.Order.updateInfo.forEach(function(each){
                    each.status = each.status.key;
                })
                var postData;
                var method = $scope.UpdateMethod;
                if(method == 0){
                    postData = {
                        dbId: $scope.Order._id,
                    status: $scope.Order.status.key,
                    updateInfo: $scope.Order.updateInfo
                }
                $remote.post("/order/pathUpdate", postData, function(data){
                    $modalInstance.close();
                    var msg = {text:$constants.MESSAGE_ORDER_PATH_UPDATE_SUCCESS};
                    $scope.showMessage(msg);
                });
                }else{
                    if($scope.Order.idBatch){
                        postData = {
                            idBatch: $scope.Order.idBatch,
                            status: $scope.Order.status.key,
                            updateInfo: $scope.Order.updateInfo
                        }
                        $remote.post("/order/pathUpdate", postData, function(data){
                            $modalInstance.close();
                            var msg = {text:$constants.MESSAGE_ORDER_PATH_UPDATE_BATCH_SUCCESS};
                            $scope.showMessage(msg);
                        });
                    }else{
                        var msg = {text:$constants.MESSAGE_ORDER_PATH_UPDATE_BATCH_CHECK_ERR};
                        $scope.showMessage(msg);
                    }
                }
            }
        }]]];
});