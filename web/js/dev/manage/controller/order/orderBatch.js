define(["thenjs", "xlsx", "iscroll"], function(then, xlsx) {
    return [["OrderBatchCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$config", "$constants", "$upload",
        function($scope, $rootScope, $remote, $modal, $scopeData, $config, $constants, $upload) {

            $scope.listOrder = function(){
                $remote.post("/order/list", null, function(data){
                    $scope.OrderList = data;
                });
            }

            //$scope.listOrder();

            $scope.processExcel = function(data){
                if(data){
                    var postData = data;
                    $remote.post("/orderBatch/processExcel", postData, function(data){
                        console.log(data);
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
                            console.log($scope.ordersData);
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

            /*$scope.commitBatch = function(){
                var postData = {
                    batchOrders:  $scope.ordersData,
                    batchProducts:  $scope.productsData,
                    creater: $scope.backInfo.loginId,
                    idBatch: "B" + new Date().format("yyyyMMddhhmmssS")
                }

                $remote.post("/orderBatch/commitBatch", postData, function(data){
                    var msg = {text:$constants.MESSAGE_FILE_EXCEL_COMMIT_SUCCESS};
                    $scope.showMessage(msg);
                    $scope.isUploaded = false;
                    $scope.ProgressBar = null;
                });
            }*/

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
                    $scope.ProgressBar = null;
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