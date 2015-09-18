define(["cryptojs-sha256"], function(crypto) {
	return [["PCenterCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$upload", "$constants", "$config", "$location",
	function($scope, $rootScope, $remote, $modal, $upload, $constants, $config, $location) {

		$scope.resetMenu = function() {
			$scope.menuList.forEach(function(each) {
				if($scope.menuShow(each.subMenu)){
					each.subMenu.forEach(function(each){
						each.active = false;
					});
				}
				each.active = false;
			});
		};

		$scope.menuShow = function(submenu){
			if(submenu && submenu.length > 0){
				return true;
			}
			return false;
		}

		$scope.selectMenu = function(item) {
			if($scope.menuShow(item.subMenu)){
				if(item.open){
					item.open = false;
				}else{
					item.open = true;
				}
			}else{
				$scope.resetMenu();
				item.active = true;
				$scope.pageSelect(item.link)
			}
		};

		$scope.menuList = [{
			"id": "A000",
			"name": "基本管理",
			"description": "",
			"role": "0",
			"level": "0",
			"subMenu": [{
				"id": "A001",
				"name": "客户信息",
				"description": "",
				"link": "cusBasic",
				"role": "0",
				"level": "1",
				"subMenu": [],
				"checked": "checked"
			}, {
				"id": "A002",
				"name": "订单管理",
				"description": "",
				"link": "cusOrder",
				"role": "0",
				"level": "1",
				"subMenu": [],
				"checked": "checked"
			}, {
				"id": "A003",
				"name": "账户充值",
				"description": "",
				"link": "cusPay",
				"role": "0",
				"level": "1",
				"subMenu": [],
				"checked": "checked"
			}, {
				"id": "A004",
				"name": "消息中心",
				"description": "",
				"link": "cusMsg",
				"role": "0",
				"level": "1",
				"subMenu": [],
				"checked": "checked"
			}
			],
			"checked": "checked"
		}]

		$scope.pageSelect = function(pageLink){
			$scope._pageLink = pageLink
			if(pageLink == 'cusBasic'){
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

				$scope.goPay = function(item){
					$rootScope._cacheOrder = item;
					$location.path('orderCustomer')
				}

				$scope.queryCustomer();
			}else if(pageLink == 'cusOrder'){
				$scope.listOrder = function(){
					$remote.post("/customerBiz/listOrder", null, function(data){
						$scope.orders = data;
					})
				}

				$scope.detailOrder = function(item){
					$rootScope.OrderId = item.id;
					$scope.queryOrder();
				}
				$scope.listOrder();
			}else if(pageLink == 'cusPay'){
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
			}else if(pageLink == 'cusMsg'){
				$scope.selectedMsg = null;

				$scope.selectMsg = function(item, index){
					if($scope.selectedMsg){
						if($scope.selectedMsg.index == index){
							$scope.selectedMsg = null;
						}else{
							$scope.selectedMsg = item;
							$scope.selectedMsg.index = index;
						}
					}else{
						$scope.selectedMsg = item;
						$scope.selectedMsg.index = index;
			}
		}

				$scope.reply = function(index){
					var msg = $scope.MsgsList[index]
					var reply = msg.reply
					if(reply){
						var element = {
							from: $scope.webInfo.loginId,
							to: "系统管理员",
							time: Date.now(),
							content: reply
						}
						var postData = {
							id: msg.id,
							details: element
						}
						$remote.post("/service/sendWebMail", postData, function(data){
							msg.details.push(element)
						});
					}
		}

				$scope.listMsg = function(){
					var postData = {
						from: "系统管理员",
						to: $scope.webInfo.loginId
		}

					$remote.post("/service/listWebMail", postData, function(data){
						$scope.MsgsList = data;
					});
		}

				$scope.listMsg()
		}
		}

		$scope.pageSelect('cusBasic')
	}]]];
});