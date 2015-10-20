define(["angular", "cryptojs-sha256", "angular-route", "angular-bootstrap", "config", "dict", "common",
        "angular-cookies", "service", "component", "angular-dragdrop", "angular-file-upload", "angular-qrcode", 'xlsx'], function(angular, crypto) {
	return angular.module('ngView', ["ngRoute", "ngConfig", "ngDict", "ngCommon", "ngCookies", "ngService", "ngComponent", "ui.bootstrap", "ngDragDrop", "angularFileUpload", "monospaced.qrcode"])

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
                templateUrl: "manage/welcome.html",
                controller: "WelcomeCtrl"
            }).when("/settings", {
                templateUrl: "manage/basic/settings.html",
                controller: "SettingsCtrl",
                resolve: {
                    ctrl: lazyCtrl("settings")
                }
            }).when("/news", {
                templateUrl: "manage/basic/news.html",
                controller: "NewCtrl",
                resolve: {
                    ctrl: lazyCtrl("news")
                }
            }).when("/customer", {
                templateUrl: "manage/customer/customer.html",
                controller: "CustomerCtrl",
                resolve: {
                    ctrl: lazyCtrl("customer")
                }
            }).when("/group", {
                templateUrl: "manage/basic/group.html",
                controller: "GroupCtrl",
                resolve: {
                    ctrl: lazyCtrl("group")
                }
            }).when("/user", {
                templateUrl: "manage/basic/user.html",
                controller: "UserCtrl",
                resolve: {
                    ctrl: lazyCtrl("user")
                }
            }).when("/order", {
                templateUrl: "manage/order/order.html",
                controller: "OrderCtrl",
                resolve: {
                    ctrl: lazyCtrl("order")
                }
            }).when("/orderBatch", {
                templateUrl: "manage/order/orderBatch.html",
                controller: "OrderBatchCtrl",
                resolve: {
                    ctrl: lazyCtrl("orderBatch")
                }
            }).otherwise({redirectTo: '/welcome'});
	    }]
	)

	/** 初始化ngView对象，初始化定义$rootScope相关方法 **/
	.run(['$rootScope', '$config', "$route", "$remote", "$dict", "$filter", "$modal",
	function($rootScope, $config, $route, $remote, $dict, $filter, $modal) {
        $(window).bind('beforeunload',function(){return '';});

        $rootScope.initJnl = function(prefix, type){
            var formatArr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
            var nowTime = new Date();
            var random = "";
            if(type == 1){
            //生成3位数字随机序列
                random = Math.ceil(Math.random()*999);
            if(random < 10){
                random = "00" + random;
            }else if(random < 100 && random >= 10){
                random = "0" + random;
                }
            }else{
            //生成4位英文随机串
            for(var i=1;i<=4;i++){
                var currentIndex = Math.floor(Math.random() * formatArr.length);
                random += formatArr[currentIndex];
            }
            }

            return prefix  + random + nowTime.format("yyMMddhhmmss");
        }

        $rootScope.checkDate = function(date) {
            var reg = /^(\d{4})(\d{2})(\d{2})$/;
            var str = date;
            var result = reg.exec(str);
            if (!(reg.test(str)&&result[2]<=12&&result[3]<=31)){
                return false;
            }
            return result[1] + "-" + result[2] + "-" + result[3];
        }

        $rootScope._WechatEntry = $config.wechatEntry;
        $rootScope.loading = false;

        $rootScope.Query = {};
        $rootScope.setQuery = function(qStr, qValue){
            $rootScope.Query[qStr] = qValue;
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

        $rootScope.getProvincesName = function(callback){
            $remote.post("/service/listProvinces", null, function(data) {
                if(data){
                    var provinces = {};
                    data.forEach(function(each){
                        provinces[each.provinceName] = each.provinceId;
                    })
                    $dict.set("ProvincesName", provinces);
                    if(callback){
                        return callback();
                    }else{
                        return provinces;
                    }
                }
            })
        }

        $rootScope.getCitysName = function(provinceId, callback){
            var postData = {
                provinceId: provinceId
            }

            $remote.post("/service/listCitys", postData, function(data) {
                if(data){
                    var citys = {};
                    data.forEach(function(each){
                        citys[each.cityName] = each.cityId;
                    })
                    $dict.set("CitysName", citys);
                    if(callback){
                        return callback();
                    }else{
                        return citys;
                    }
                }
            })
        }

        $rootScope.getAreasName = function(cityId, callback){
            var postData = {
                cityId: cityId
            }

            $remote.post("/service/listAreas", postData, function(data) {
                if(data){
                    var areas = {};
                    data.forEach(function(each){
                        areas[each.areaName] = each.areaId;
                    })
                    $dict.set("AreasName", areas);
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

        $rootScope.checkMenu = function(item){
            var menus = [];
            item.forEach(function(each){
                if(each["checked"]){
                    if(each["subMenu"]){
                        each["subMenu"].forEach(function(sub){
                            if(sub["checked"]){
                                menus.push(sub["_id"]);
                            }
                        });
                    }
                    menus.push(each["_id"]);
                }
            })
            return menus;
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

            if(!$rootScope.msg) {
                $rootScope.msg = true;
            var modalMsg = $modal.open({
                templateUrl: 'message',
                controller: 'MessageCtrl',
                size: "sm",
                    scope: scope,
                    backdrop: 'static',
                    keyboard:false
            });

                modalMsg.result.then(function (result) {
                    $rootScope.msg = false;
                }, function (reason) {
                    $rootScope.msg = false;
                });
            }

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
	.controller("BaseCtrl", ["$scope", "$rootScope", "$cookies", "$location", "$remote", "$config", "$modal", "$constants", "$dict",
    function ($scope, $rootScope, $cookies, $location, $remote, $config, $modal, $constants, $dict) {
        $rootScope.backInfo = JSON.parse($cookies.backInfo || "{}");
        $rootScope.menuList = JSON.parse($cookies.menuList || "{}");

        $scope.checkForm = function(formElement){
            console.log(formElement)
            for(var item in formElement){
                //var name = "" + item;
                //console.log(typeof(formElement[item]))
                if(typeof(formElement[item]) == "object"  && formElement[item]){
                    var itemName = $("input[name='" + item + "']").attr("placeholder") || ""
                    if(formElement[item].$invalid){
                        var msg = {text:$constants.MESSAGE_FORM_INVALID + "(" + itemName + ")"};
                $scope.showMessage(msg);
                        console.log(item + ":" + formElement[item].$invalid)
                        return false
            }
                }
            }
            return true
            //if(formElement.$invalid){
            //    var msg = {text:$constants.MESSAGE_FORM_INVALID};
            //    $scope.showMessage(msg);
            //    return false;
            //}
            //return true;
        }

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
            }
        };

        $scope.logout = function(){
            var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_EXIT, confCallback:function(){
                $remote.post("/userBiz/logout", null, function(data){
                    $cookies.backInfo = "";
                    $rootScope.backInfo = {};
                });
            }};
            $scope.showMessage(msg);
		};

        $scope.login = function() {
            var loginTime = new Date().getTime();
            var password = crypto.SHA256($scope.password).toString();
            var encPassword = crypto.HmacSHA256(password, $config.encrySeed).toString();
            password = crypto.HmacSHA256(encPassword, $scope.loginId+":"+loginTime).toString();
            var formData = {
                loginId: $scope.loginId,
                password: password,
                loginTime: loginTime
            };

            $remote.post("/service/listMenus", null, function(data) {
                var allMenu = data;

                $remote.post("/userBiz/login", formData, function(data){
                    var groupMenu = data.group.menu;

                    var menu = [];
                    allMenu.forEach(function(menuItem, menuIndex){
                       /* menuItem.checked = "checked";
                        if(menuItem.subMenu) {
                            var sub = [];
                            menuItem.subMenu.forEach(function (subItem, subIndex) {
                                subItem.checked = "checked";
                                sub.push(subItem);
                            });
                            menuItem.subMenu = sub;
                        }
                        menu.push(menuItem);*/
                        if(menuItem.subMenu){
                         menuItem.subMenu.forEach(function(subItem,subIndex){
                             groupMenu.forEach(function(selfItem){
                                 if(subItem.id == selfItem.id){
                                     subItem.checked = "checked";
                                     return;
                                 }
                             });
                         });
                        }
                        groupMenu.forEach(function(selfItem){
                            if(menuItem.id == selfItem.id){
                                 menuItem.checked = "checked";
                                 return;
                            }
                        });
                    });

                    //$rootScope.menuList = menu;
                    $rootScope.menuList = allMenu;

                    $rootScope.backInfo = data;
                    $rootScope.backInfo.isLogin = true;
                    var userInfo = data;
                    userInfo.group = null;

                    $cookies.backInfo = JSON.stringify(userInfo);
                    $cookies.menuList = JSON.stringify($rootScope.menuList);

                    $location.path('welcome');
                }, function(data){
                    $scope.Error = data;
                });
            });
        };
	}]).controller("WelcomeCtrl", ["$scope", "$rootScope", "$location", "$remote", "$modal",
    function ($scope, $rootScope, $location, $remote, $modal) {

    }]).controller('LoadingCtrl', ["$scope", "$rootScope", "$modalInstance",
    function ($scope, $rootScope, $modalInstance) {
        $rootScope.closeLoading = function(){
            $modalInstance.close();
            $rootScope.loading = false;
        }
    }])
});
