define(["angular", "config"], function(angular) {
	Date.prototype.format = function(format)
	{
		var o = {
			"M+" : this.getMonth()+1, //month
			"d+" : this.getDate(),    //day
			"h+" : this.getHours(),   //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
			"S" : this.getMilliseconds() //millisecond
		}
		if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
			(this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		return format;
	};
	window.longCount = function(str1,str2,type) {
		var comma1 = 0;
		if (str1.indexOf(".")!=-1) {
			str1 = str1.replace(/0*$/,"");
			comma1 = str1.length - str1.indexOf(".")-1;
		}
		var comma2 = 0;
		if (str2.indexOf(".")!=-1) {
			str2 = str2.replace(/0*$/,"");
			comma2 = str2.length - str2.indexOf(".")-1;
		}
		str1 = str1.replace(/\./,"");
		str2 = str2.replace(/\./,"");
		var value,comma;
		if (type!="*") {
			if (comma1>comma2) {
				for (var i=0;i<comma1-comma2;i++) str2 += "0";
				comma = (type=="/")?0:comma1;
			}else {
				for (var i=0;i<comma2-comma1;i++) str1 += "0";
				comma = (type=="/")?0:comma2;
			}
		}else {
			comma = comma1 + comma2;
		}
		if (type=="+") {
			value = parseInt(str1,10) + parseInt(str2,10);
		}else if (type=="-") {
			value = parseInt(str1,10) - parseInt(str2,10);
		}else if (type=="*") {
			value = parseInt(str1,10) * parseInt(str2,10);
		}else if (type=="/") {
			value = parseInt(str1,10) / parseInt(str2,10);
		}
		value = String(value);
		if (comma>0) value = value.substring(0,value.length-comma)+"."+value.substring(value.length-comma,value.length);
		if (value.indexOf(".")!=-1)
			value = value.replace(/0*$/,"");
		return value;
	}
	angular.module('ngService', ["ngConfig"])
	.factory("$singleton", function() {
		return function(fn) {
			var flag ;
			function singleton () {
				if (flag) {
					return flag;
				}
				flag = fn.apply(this, arguments);
				return flag;
			}
			return singleton;
		};
	})
	
	.factory("$toggle", function() {
		return function (fun1, fun2) {
			if (typeof fun1 != "function" || typeof fun2 != "function") {
				return;
			}
			var toggle;
			return function() {
				toggle && fun1();
				!toggle && fun2();
				toggle = !toggle;
			};
		};
	})
	
	.factory("$scopeData", function() {
		var scopeData = {};
		
		return {
			set: function(key, object) {
				if (scopeData[key]) {
					scopeData[key] = object
					return;
				}
				scopeData[key] = object;
			},
			get: function(key) {
				return scopeData[key];
			}
		};
	})
	
	.factory("$remote", ["$restful", function($restful) {
		return {
			post: $restful.post,
			get: $restful.get
		};
	}])

	.factory("$restful", ["$rootScope", "$http", "$cookies", "$location", function($rootScope, $http, $cookies, $location) {
		function dealError(errorCallback, data, status, headers, config){
			if(status == 400){
				if(data == "登录状态已失效，请重新登录后操作"){
                    $cookies.backInfo = "";
					$rootScope.backInfo = {};
					$cookies.webInfo = "";
					$rootScope.webInfo = {};
					$location.path("#/")
                    var msg = {text:data};
                    $rootScope.showMessage(msg)
				}else if(typeof errorCallback != "function"){
                    var msg = {text:data};
                    $rootScope.showMessage(msg)
                    $rootScope.ERROR = data;
				}else{
					errorCallback(data, status, headers, config);
				}
    		}else if(typeof errorCallback == "function"){
				errorCallback(data, status, headers, config);
			}
		}

		function get(url, successCallback, errorCallback){
	    	return $http.get(url).success(function(data ,status, headers, config){
	    		if(typeof successCallback == "function"){
	    			successCallback(data, status, headers, config);
	    		}
	    	}).error(function(data, status, headers, config){
	    		dealError(errorCallback, data, status, headers, config);
	    	});
	    }
	    
		function post(url, requestData, successCallback, errorCallback) {
            if($rootScope.showLoading){
                $rootScope.showLoading();
            }
			return $http.post(url, requestData).success(function(data ,status, headers, config){
	    		if(typeof successCallback == "function"){
	    			successCallback(data, status, headers, config);
                    if($rootScope.closeLoading){
                        $rootScope.closeLoading();
                    }
	    		}
	    	}).error(function(data, status, headers, config){
                if($rootScope.closeLoading){
                    $rootScope.closeLoading();
                }
	    		dealError(errorCallback, data, status, headers, config);
	    	});
		}
	    
		function put(url, requestData, successCallback, errorCallback) {
			return $http.put(url, requestData).success(function(data ,status, headers, config){
	    		if(typeof successCallback == "function"){
	    			successCallback(data, status, headers, config);
	    		}
	    	}).error(function(data, status, headers, config){
	    		dealError(errorCallback, data, status, headers, config);
	    	});
		}
	    
		function del(url, successCallback, errorCallback) {
			return $http.put(url).success(function(data ,status, headers, config){
	    		if(typeof successCallback == "function"){
	    			successCallback(data, status, headers, config);
	    		}
	    	}).error(function(data, status, headers, config){
	    		dealError(errorCallback, data, status, headers, config);
	    	});
		}
		
		return {
			post: post,
			get: get,
			put: put,
			delete: del
		};
	}])
});
