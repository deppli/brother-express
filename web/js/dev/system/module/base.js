﻿define(["angular", "cryptojs-sha256", "angular-route", "angular-bootstrap", "config", "dict", "common",
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
			}).when("/msg", {
                    templateUrl: "system/portal/msg.html",
                    controller: "MsgCtrl",
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
            var formatArr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
            var nowTime = new Date();
            /*
             //生成3位数字随机序列
            var random = Math.ceil(Math.random()*999);
            if(random < 10){
                random = "00" + random;
            }else if(random < 100 && random >= 10){
                random = "0" + random;
             }*/
            var random = "";
            //生成4位英文随机串
            for(var i=1;i<=4;i++){
                var currentIndex = Math.floor(Math.random() * formatArr.length);
                random += formatArr[currentIndex];
            }
            return prefix  + random + nowTime.format("yyMMddhhmmss");
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

        $rootScope.getAreas = function(cityId, callback){
            var postData = {
                cityId: cityId
            }

            $remote.post("/service/listAreas", postData, function(data) {
                if(data){
                    var areas = {};
                    data.forEach(function(each){
                        areas[each.areaId] = each.areaName;
                    })
                    $dict.set("Areas", areas);
                    if(callback){
                        return callback();
                    }else{
                        return areas;
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
        $(".online-service-top").click(function(){
            var os=$(this).children();
            if(os.hasClass("arrowUp")){
                $(".online-service").css("zoom",0.5)
                os.removeClass().addClass("arrowDown")
            }
            else{
                $(".online-service").css("zoom",1)
                os.removeClass().addClass("arrowUp")
            }
            $(".onlineService").slideToggle("500");
        })

        $rootScope.webInfo = JSON.parse($cookies.webInfo || "{}");

        $scope.menuList = [
            {name: "首页", link: "#/welcome", role: function() {return true}, active: true},
            {name: "开始下单", link: "#/order", role: function() {return true}},
            {name: "公司介绍", link: "#/company", role: function() {return true}},
            {name: "常见问题", link: "#/questions", role: function() {return true}},
            {name: "业务介绍", link: "#/business", role: function() {return true}},
            {name: "最新公告", link: "#/msg", role: function() {return true}},
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
                if(data.gateApi == 1){
                    //orderData.orderId = "ETTPEJJ56531EWE0518TEST1ET";
                    $remote.post("/service/thirdTJPath", orderData, function(data){
                        if(data && data.list && data.list[0]){
                            $scope.Order.orderTJPaths = data.list[0].trackdata;
                        }
                    }, function(){
                        $scope.pathError = "获取第三方轨迹记录失败，请重试或联系客服"
                    })
                }else{
                $remote.post("/service/thirdPath", orderData, function(data){
                    $scope.Order.orderPaths = data.trackingEventList;
                }, function(){
                    $scope.pathError = "获取第三方轨迹记录失败，请重试或联系客服"
                })
                }

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

        //上传证件照
        $scope.uploadId = function(){
            var modalInstance = $modal.open({
                templateUrl: 'uploadModal',
                controller: 'UploadCtrl',
                size: "sm",
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

    }]).controller("UploadCtrl", ["$scope", "$rootScope", "$config", "$constants", "$upload", "$remote", "$modalInstance",
    function ($scope, $rootScope, $config, $constants, $upload, $remote, $modalInstance) {
        $scope.idAUrl = null;
        $scope.idBUrl = null;

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
                        url: '/service/upload?type=1&file=' + $scope.Order.id + '_A',
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressA.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressA.dynamic = 100;
                        $scope.idAUrl = $config.idCardPath + $scope.Order.id + '_A.jpg'
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
                        url: '/service/upload?type=1&file=' + $scope.Order.id + '_B',
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressB.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressB.dynamic = 100;
                        $scope.idBUrl = $config.idCardPath + $scope.Order.id + '_B.jpg'
                    });
                }
            }
        });

        $scope.updateOrder = function(){
            if($scope.idAUrl && $scope.idBUrl){
                var postData = {
                    id: $scope.Order._id,
                    orderId: $scope.Order.id,
                    idAUrl: $scope.idAUrl,
                    idBUrl: $scope.idBUrl
                }

                $remote.post("/service/updateOrderIdno", postData, function(data){
                    var msg = {text:$constants.MESSAGE_ORDER_IDNOIMG_UPDATED};
                    $rootScope.showMessage(msg);
                    $modalInstance.close();
                })
            }else{
                var msg = {text:$constants.MESSAGE_MUST_UPLOAD_IDNO};
                $rootScope.showMessage(msg);
            }
        }
    }]).controller('LoadingCtrl', ["$scope", "$rootScope", "$modalInstance",
    function ($scope, $rootScope, $modalInstance) {
        $rootScope.closeLoading = function(){
            $modalInstance.close();
            $rootScope.loading = false;
        }
    }])
});
