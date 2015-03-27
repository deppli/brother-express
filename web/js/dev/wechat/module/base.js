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
                templateUrl: "wx/welcome.html",
                controller: "WelcomeCtrl"
            }).otherwise({redirectTo: '/'});
	    }]
	)

	/** 初始化ngView对象，初始化定义$rootScope相关方法 **/
	.run(['$rootScope', '$config', "$route", "$remote", "$dict", "$filter",
	function($rootScope, $config, $route, $remote, $dict, $filter) {
        $rootScope._WechatEntry = $config.wechatEntry;

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
	}]).controller("UpdateOrderCtrl", ["$scope", "$remote", "$modalInstance",
    function ($scope, $remote, $modalInstance) {
        var result = $scope.initOptions("OrderStatus", $scope.Order.status);
        $scope.OrderStatusList = result[0];
        $scope.status = $scope.OrderStatusList[result[1]];

        $scope.updateOrder = function(){
            if($scope.Order && $scope.Order._id){
                var postData = {
                    orderId: $scope.Order._id,
                    loginId: $scope.loginId,
                    gis: $scope.gis||"",
                    gisText: $scope.gisText||"",
                    status: $scope.status.key||0,
                    remark: $scope.remark||"无"
                }

                $remote.post("/service/updateOrder", postData, function(data){
                    alert("订单更新成功");
                    $modalInstance.close();
                });
            }
        }
    }])
});
