define(["angular", "cryptojs-sha256", "angular-route", "angular-bootstrap", "config", "dict", "common",
        "angular-cookies", "service", "component", "angular-dragdrop","angular-file-upload"], function(angular, crypto) {
	return angular.module('ngView', ["ngRoute", "ngConfig", "ngDict", "ngCommon", "ngCookies", "ngService", "ngComponent", "ui.bootstrap", "ngDragDrop", "angularFileUpload"])

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

		    $routeProvider.when("/welcome", {
                templateUrl: "system/welcome.html",
                controller: "WelcomeCtrl"
            }).when("/reg", {
                templateUrl: "system/biz/reg.html",
                controller: "RegCtrl",
                resolve: {
                    ctrl: lazyCtrl("reg")
                }
            }).when("/pcenter", {
                templateUrl: "system/pcenter/pcenter.html",
                controller: "PCenterCtrl",
                resolve: {
                    ctrl: lazyCtrl("pcenter")
                }
            })
            .when("/order", {
                templateUrl: "system/biz/orderCheck.html",
                controller: "OrderCtrl",
                resolve: {
                    ctrl: lazyCtrl("order")
                }
            }).when("/orderGuest", {
                templateUrl: "system/biz/orderGuest.html",
                controller: "OrderStepCtrl",
                resolve: {
                    ctrl: lazyCtrl("order")
                }
            }).when("/orderCustomer", {
                templateUrl: "system/biz/orderGuest.html",
                controller: "OrderStepCtrl",
                resolve: {
                    ctrl: lazyCtrl("order")
                }
            }).when("/company", {
				templateUrl: "system/portal/company.html",
				controller: "CompanyCtrl",
				resolve: {
					ctrl: lazyCtrl("portal")
				}
			}).when("/questions", {
				templateUrl: "system/portal/questions.html",
				controller: "QuestionsCtrl",
				resolve: {
					ctrl: lazyCtrl("portal")
				}
			}).when("/business", {
				templateUrl: "system/portal/business.html",
				controller: "BusinessCtrl",
				resolve: {
					ctrl: lazyCtrl("portal")
				}
			}).when("/contact", {
                templateUrl: "system/portal/contact.html",
                controller: "ContactCtrl",
                resolve: {
                    ctrl: lazyCtrl("portal")
                }
            }).when("/links", {
				templateUrl: "system/portal/links.html",
				controller: "LinksCtrl",
				resolve: {
					ctrl: lazyCtrl("portal")
				}
			}).otherwise({redirectTo: '/welcome'});
	    }]
	)

	/** 初始化ngView对象，初始化定义$rootScope相关方法 **/
	.run(['$rootScope', '$config', "$route", "$remote", "$modal", "$dict", "$filter", "$constants", "$location",
	function($rootScope, $config, $route, $remote, $modal, $dict, $filter, $constants, $location) {
        $rootScope.config = $config;

        $rootScope.initJnl = function(prefix){
            var nowTime = new Date();
            var random = Math.ceil(Math.random()*999);
            if(random < 10){
                random = "00" + random;
            }else if(random < 100 && random >= 10){
                random = "0" + random;
            }
            return prefix + nowTime.format("yyMMddhhmmss") + random;
        }

        $rootScope.goAnchor = function (id) {
            $location.hash(id);
        }

        //跳转至下单处理页面
        $rootScope.go = function(path){
            $location.path(path);
        }

        $rootScope.showLoading = function(){
            if(!$rootScope.loading){
                $rootScope.loading = true;
                var modalMsg = $modal.open({
                    templateUrl: 'loading',
                    controller: 'LoadingCtrl',
                    backdrop: 'static',
                    keyboard: false,
                    size: "sm"
                });
            }
        }

        $rootScope.showMessage = function(msg){
            var scope = $rootScope.$new();

            scope.msg = {type:0,text:"请确认点击关闭"};

            if(msg){
                scope.msg = msg;
            }

            var modalMsg = $modal.open({
                templateUrl: 'message',
                controller: 'MessageCtrl',
                size: "sm",
                scope: scope,
                backdrop: 'static',
                keyboard:false
            });

            /*modalMsg.result.then(function (result) {
             console.log(result);
             });*/
        }

        $rootScope.getProvinces = function(callback){
            $remote.post("/service/listProvinces", null, function(data) {
                if(data){
                    var provinces = {};
                    data.forEach(function(each){
                        provinces[each.provinceId] = each.provinceName;
                    })
                    $dict.set("Provinces", provinces);
                    if(callback){
                        return callback();
                    }else{
                        return provinces;
                    }
                }
            })
        }

        $rootScope.getCitys = function(provinceId, callback){
            var postData = {
                provinceId: provinceId
            }

            $remote.post("/service/listCitys", postData, function(data) {
                if(data){
                    var citys = {};
                    data.forEach(function(each){
                        citys[each.cityId] = each.cityName;
                    })
                    $dict.set("Citys", citys);
                    if(callback){
                        return callback();
                    }else{
                        return citys;
                    }
                }
            })
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

        $rootScope.checkForm = function(formElement){
            if(formElement.$invalid){
                var msg = {text:$constants.MESSAGE_FORM_INVALID};
                $rootScope.showMessage(msg);
                return false;
            }
            return true;
        }
	}])

	.controller("BaseCtrl", ["$scope", "$rootScope", "$cookies", "$location", "$remote", "$modal",
    function ($scope, $rootScope, $cookies, $location, $remote, $modal) {
        $rootScope.webInfo = JSON.parse($cookies.webInfo || "{}");

        $scope.menuList = [
            {name: "首页", link: "#/welcome", role: function() {return true}, active: true},
            {name: "开始下单", link: "#/order", role: function() {return true}},
            {name: "公司介绍", link: "#/company", role: function() {return true}},
            {name: "常见问题", link: "#/questions", role: function() {return true}},
            {name: "业务介绍", link: "#/business", role: function() {return true}},
            {name: "联系方式", link: "#/contact", role: function() {return true}},
            {name: "合作伙伴", link: "#/links", role: function() {return true}}
        ];

        $scope.resetMenu = function() {
            $scope.menuList.forEach(function(each) {
                each.active = false;
            });
        };

        $scope.selectMenu = function(item) {
            $scope.resetMenu();
            item.active = true;
        };

        $scope.reg = function(){
            $location.path('reg');
        }

        $scope.login = function() {
            var modalInstance = $modal.open({
                templateUrl: 'loginModal',
                controller: 'LoginCtrl',
                size: "sm"
            });

            modalInstance.result.then(function() {

            });
        };

        $scope.logout = function(){
			$remote.post("/customerBiz/logout", null, function(data){
                $cookies.webInfo = "";
                $rootScope.webInfo = {};
                $location.path('welcome');
			});
		};

        $scope.pcenter = function(){
            $location.path('pcenter');
        }

        //$scope.OrderId = "610291500140161";

        //查询单号指定的订单信息
        $scope.queryOrder = function(){
            var orderId = $scope.OrderId;
            if(orderId){
                orderId = orderId.toUpperCase()
            }
            var postData = {id : orderId};
            $scope.Order = null;
            $scope.Error = null;

            $remote.post("/service/queryOrder", postData, function(data){
                $scope.Order = data;

                var orderData = {
                    orderId: data.id
                }

                $scope.pathError = null;
                $remote.post("/service/thirdPath", orderData, function(data){
                    $scope.Order.orderPaths = data.trackingEventList;
                }, function(){
                    $scope.pathError = "获取第三方轨迹记录失败，请重试或联系客服"
                })

                var modalInstance = $modal.open({
                    templateUrl: 'orderModal',
                    controller: 'WelcomeCtrl',
                    size: "lg",
                    scope:$scope
                });
            }, function(data){
                $scope.Error = data;
            });
        }

        //查询国内物流信息(第三方API)
        $scope.queryExpress = function(){
            var modalInstance = $modal.open({
                templateUrl: 'expressModal',
                controller: 'ExpressCtrl',
                size: "lg",
                scope:$scope
            });
            modalInstance.opened.then(function(){
            });
            modalInstance.result.then(function() {
            });
        }
	}]).controller("WelcomeCtrl", ["$scope", "$rootScope", "$location", "$remote", "$modal",
    function ($scope, $rootScope, $location, $remote, $modal) {
        $scope.displayMode = 0;
        //变更快捷菜单，查询/下单
        $scope.changeMode = function(mode){
            $scope.displayMode = mode;
        }

        $scope.detailOrder = function(){
            $rootScope.OrderId = $scope.OrderId;
            $scope.queryOrder();
        }

        //跳转至下单处理页面
        $scope.goOrder = function(){
            $location.path('order');
        }

    }]).controller("MessageCtrl", ["$scope", "$rootScope", "$cookies", "$location", "$remote", "$config", "$modalInstance",
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
    }]).controller("LoginCtrl", ["$scope", "$rootScope", "$location", "$remote", "$config", "$cookies", "$modalInstance",
    function ($scope, $rootScope, $location, $remote, $config, $cookies, $modalInstance) {
        $scope.isReset = false;
        $scope.isSend = false;
        $scope.checkReset = function(){
            $scope.isReset = true;
        }

        $scope.forgetPassword = function(){
            var formData = {loginId : $scope.loginId}
            $remote.post("/service/forgetPassword", formData, function(data){
                var msg = {type:0,text:"密码重置邮件已发送"};
                $scope.showMessage(msg)
                $modalInstance.close();
            })
        }

        $scope.submit = function() {
            var loginTime = new Date().getTime();
            var password = crypto.SHA256($scope.password).toString();
            var encPassword = crypto.HmacSHA256(password, $config.encrySeed).toString();
            password = crypto.HmacSHA256(encPassword, $scope.loginId+":"+loginTime).toString();
            var formData = {
                loginId: $scope.loginId,
                password: password,
                loginTime: loginTime
            };
            $remote.post("/customerBiz/login", formData, function(data){
                $rootScope.webInfo = data;
                $rootScope.webInfo.isLogin = true;
                $cookies.webInfo = JSON.stringify($rootScope.webInfo);
                $modalInstance.close(data);
                if($rootScope._loginPath){
                    $location.path($rootScope._loginPath);
                    $rootScope._loginPath = null;
                }else{
                $location.path('welcome');
                }
            }, function(data){
                $scope.Error = data;
            });
        };
    }]).controller("ExpressCtrl", ["$scope", "$rootScope", "$location",
    function ($scope, $rootScope, $location) {

    }]).controller('LoadingCtrl', ["$scope", "$rootScope", "$modalInstance",
    function ($scope, $rootScope, $modalInstance) {
        $rootScope.closeLoading = function(){
            $modalInstance.close();
            $rootScope.loading = false;
        }
    }])
});
