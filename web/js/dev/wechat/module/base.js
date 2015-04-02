define(["angular", "angular-route", "angular-bootstrap", "config", "dict", "common",
        "angular-cookies", "service", "component", "angular-qrcode"], function(angular) {
	return angular.module('ngView', ["ngRoute", "ngConfig", "ngDict", "ngCommon", "ngCookies", "ngService", "ngComponent", "ui.bootstrap", "monospaced.qrcode"])

	.config(
            ["$routeProvider", "$httpProvider", "$controllerProvider", function($routeProvider, $httpProvider, $controllerProvider) {
                var lazyCtrl = function(ctrlName) {
                    return ["$q", "$rootScope", function($q, $rootScope) {
                        var deferred = $q.defer();
                        require(["base", ctrlName], function(base, ctrl) {
                            if (typeof ctrl[0] == "object") {
                                ctrl.forEach(function(each) {
                                    $controllerProvider.register.apply(base, each);
                                });
                            } else if (typeof ctrl[0] == "string") {
                                $controllerProvider.register.apply(base, ctrl);
                            }
                            deferred.resolve();
                            $rootScope.$digest();
                        });
                        return deferred.promise;
                    }];
                };

		    $routeProvider.when("/", {
                templateUrl: "wechat/welcome.html",
                controller: "WelcomeCtrl"
            }).otherwise({redirectTo: '/'});
	    }]
	)

	/** 初始化ngView对象，初始化定义$rootScope相关方法 **/
	.run(['$rootScope', '$config', "$route", "$remote", "$dict", "$filter", "$modal", "$constants",
	function($rootScope, $config, $route, $remote, $dict, $filter, $modal, $constants) {
        $rootScope._WechatEntry = $config.wechatEntry;

        $rootScope.showMessage = function(msg){
            var scope = $rootScope.$new();

            scope.msg = {type:0,text:"请确认点击关闭"};

            if(msg){
                scope.msg = msg;
            }

            if(!$rootScope.msg) {
                $rootScope.msg = true;
                var modalMsg = $modal.open({
                    templateUrl: 'message',
                    controller: 'MessageCtrl',
                    size: "sm",
                    scope: scope
                });

                modalMsg.result.then(function (result) {
                    $rootScope.msg = false;
                }, function (reason) {
                    $rootScope.msg = false;
                });
            }

        }

        $rootScope.checkForm = function(formElement){
            if(formElement.$invalid){
                var msg = {text:$constants.MESSAGE_FORM_INVALID};
                $rootScope.showMessage(msg);
                return false;
            }
            return true;
        }

        //初始化下拉框选项
        $rootScope.initOptions = function(name, defaultKey){
            var location = $dict.get(name);

            var result = [];
            var list = [];
            var index = 0;
            var finalIndex = 0;
            for (var key in location) {
                if(defaultKey && defaultKey == key){
                    finalIndex = index;
                }
                var item = {};
                item.key = key;
                item.value = $filter('dict')(key, name);
                list.push(item);
                index++;
            }

            result[0] = list;
            result[1] = finalIndex;
            return result;
        }
	}])
	.controller("BaseCtrl", ["$scope","$location", "$remote", "$modal",
    function ($scope, $location, $remote, $modal) {
        var postData = {
            id: $location.search().OrderId
        }

        $remote.post("/service/queryOrder", postData, function(data){
            $scope.Order = data;
        });

        $scope.openModal = function(){
            var modalUpdateOrder = $modal.open({
                templateUrl: 'updateOrderModal',
                controller: 'UpdateOrderCtrl',
                size: "sm",
                scope: $scope
            });
        }
	}])
    .controller("MessageCtrl", ["$scope", "$rootScope", "$cookies", "$location", "$remote", "$config", "$modalInstance",
        function ($scope, $rootScope, $cookies, $location, $remote, $config, $modalInstance) {
            $scope.close = function(){
                if($scope.msg.closeCallback){
                    $scope.msg.closeCallback();
                }
                $modalInstance.close();
            }

            $scope.confirm = function(){
                if($scope.msg.confCallback){
                    $scope.msg.confCallback();
                }
                $modalInstance.close();
            }
        }])
    .controller("UpdateOrderCtrl", ["$scope", "$remote", "$modalInstance",
    function ($scope, $remote, $modalInstance) {
        var result = $scope.initOptions("OrderStatus", $scope.Order.status);
        $scope.OrderStatusList = result[0];
        $scope.status = $scope.OrderStatusList[result[1]];

        $scope.updateOrder = function(){
            if($scope.Order && $scope.Order._id){
                if($scope.checkForm($scope.updateOrderForm)){
                var postData = {
                    orderId: $scope.Order._id,
                    loginId: $scope.loginId,
                    gis: $scope.gis||"",
                    gisText: $scope.gisText||"",
                    status: $scope.status.key||0,
                    remark: $scope.remark||"无"
                }

                $remote.post("/service/updateOrder", postData, function(data){
                    $modalInstance.close();
                        var msg = {text:$constants.MESSAGE_ORDER_PATH_UPDATE_SUCCESS};
                        $scope.showMessage(msg);
                });
            }
        }
        }
    }])
});
