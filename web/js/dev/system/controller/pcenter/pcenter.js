define(["cryptojs-sha256"], function(crypto) {
	return [["PCenterCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$upload", "$constants", "$config", "$location",
	function($scope, $rootScope, $remote, $modal, $upload, $constants, $config, $location) {
		window.$scope = $scope;

		$scope.$watch("idImgA", function(){
			var file = $scope.idImgA;
			if(file){
				$scope.ProgressA = {};
				$scope.idAUrl = null;
				if(file[0].size > $config.maxIdFileSize) {
					var msg = {text: $constants.MESSAGE_FILE_TOO_BIG};  //200K
					$scope.showMessage(msg);
				}else{
					$upload.upload({
						url: '/service/upload?type=1&file=' + $scope.Customer.idNo + '_A',
						file: file[0]
					}).progress(function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						$scope.ProgressA.dynamic = progressPercentage;
					}).success(function (data, status, headers, config) {
						$scope.ProgressA.dynamic = 100;
						$scope.idAUrl = $config.idCardPath + $scope.Customer.idNo + '_A.jpg'
					});
				}
			}
		});

		$scope.$watch("idImgB", function(){
			var file = $scope.idImgB;
			if(file) {
				$scope.ProgressB = {};
				$scope.idBUrl = null;
				if(file[0].size > $config.maxIdFileSize) {
					var msg = {text: $constants.MESSAGE_FILE_TOO_BIG};  //200K
					$scope.showMessage(msg);
				}else{
					$upload.upload({
						url: '/service/upload?type=1&file=' + $scope.Customer.idNo + '_B',
						file: file[0]
					}).progress(function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						$scope.ProgressB.dynamic = progressPercentage;
					}).success(function (data, status, headers, config) {
						$scope.ProgressB.dynamic = 100;
						$scope.idBUrl = $config.idCardPath + $scope.Customer.idNo + '_B.jpg'
					});
				}
			}
		});

		$scope.queryCustomer = function(){
			$remote.post("/customerBiz/queryCustomer", null, function(data){
				$scope.Customer = data;
				$scope.Customer.idType = "身份证"
				$scope.idAUrl = $scope.Customer.idNoImgA||"";
				$scope.idBUrl = $scope.Customer.idNoImgB||"";
			})
		}

		$scope.queryCustomer();

		$scope.tabSelect = function(tabIndex){
			if(tabIndex == 0){
				$scope.queryCustomer();
			}else if(tabIndex == 1){
				$scope.listOrder();
			}else if(tabIndex == 2){
				$scope.balanceOrder = {}
				$scope.balanceOrder.showMode = 0	//展示模式，默认0-展示充值页面，1-充值成功
				$scope.balanceOrder.payId = $scope.initJnl("A");
				$remote.post("/customerBiz/queryBalance", null, function(data){
					if(data){
						$scope.balanceOrder.balance = data.balance || 0;
					}
				});

				$scope.syncPayStatus = function(){
					var postData = {
						orderId: $scope.balanceOrder.payId
					}
					$remote.post("/customerBiz/queryBalancePayStatus", postData, function(data){
						if(data && data.payStatus == "1"){
							$scope.balanceOrder.showMode = 0
						}else{
							var msg = {text:$constants.MESSAGE_PAY_STATUS_FAIL}
							$scope.showMessage(msg);
						}
					});
				}


				$scope.goBalancePay = function(){
					debugger
					if($scope.balanceOrder.payAmt && $scope.balanceOrder.payAmt > 0){
						jQuery("#acctPay").submit();
						var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_PAY_SUCCESS, confCallback:function(){
							$scope.syncPayStatus();
						}};
						$scope.showMessage(msg);
					}else{
						console.log($scope);
						console.log($scope.balanceOrder.payAmt);
						console.log("金额输入错误")
					}
				}
			}
		}

		$scope.tabCheck = function(tabIndex){
			$scope.$$childHead.tabs[tabIndex].active = true
		}

		$scope.listOrder = function(){
			$remote.post("/customerBiz/listOrder", null, function(data){
				$scope.orders = data;
			})
		}

		$scope.detailOrder = function(item){
			$rootScope.OrderId = item.id;
			$scope.queryOrder();
		}

		$scope.goPay = function(item){
			$rootScope._cacheOrder = item;
			$location.path('orderCustomer')
		}
	}]]];
});