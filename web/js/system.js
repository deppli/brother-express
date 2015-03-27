(function(require, define) {
	/**
	 * dev开发 pro生产
	 */
	var mode = "dev";

	require.config({
	    baseUrl: "js/" + mode,
        shim: {
            angular: {
                exports: "angular",
                deps: ["jquery"]
            },
            "angular-route": {
                deps: ["angular"]
            },
            "angular-cookies": {
                deps: ["angular"]
            },
            "angular-bootstrap": {
                deps: ["angular"]
            },
            "angular-dragdrop": {
                deps: ["angular", "jquery", "jquery-ui"]
            },
            "angular-file-upload": {
                deps: ["angular"]
            },
            'cryptojs-core': {
	            exports: "CryptoJS"
	        },
	        'cryptojs-hmac': {
	            deps: ['cryptojs-core'],
	            exports: "CryptoJS"
	        },
	        'cryptojs-sha256': {
	            deps: ['cryptojs-core', 'cryptojs-hmac'],
	            exports: "CryptoJS"
	        }
        },
		paths: {
			/**
			 * lib
			 */
			es5: "lib/es5/es5-shim.min",
			json3: "lib/json3/lib/json3.min",
			spin: "lib/spin/spin",
			jquery: "lib/jquery/dist/jquery.min",
            "jquery-ui": "lib/jquery-ui/jquery-ui",
			angular: "lib/angular/angular.min",
            "angular-route": "lib/angular-route/angular-route.min",
            "angular-cookies": "lib/angular-cookies/angular-cookies.min",
            "angular-bootstrap": "lib/angular-bootstrap/ui-bootstrap-tpls-0.12.0.min",
            "angular-dragdrop": "lib/angular-dragdrop/src/angular-dragdrop.min",
            "angular-file-upload": "lib/angular-file-upload/dist/angular-file-upload.min",
            "cryptojs-core": "lib/crypto/build/components/core-min",
            "cryptojs-hmac": "lib/crypto/build/components/hmac-min",
            "cryptojs-sha256": "lib/crypto/build/components/sha256-min",
            xlsx: "lib/xlsx/dist/xlsx.core.min",
            thenjs: "lib/thenjs/then.min",

            common: "public/common",
            service: "public/service",
            component: "public/component",
            dict: "public/dict",
            config: "public/config",
			/**
			 * angular module
			 */
			base: "system/module/base",

			/**
			 * controller
			 */
            portal: "system/controller/portal/portal",
            reg: "system/controller/biz/reg",
            order: "system/controller/biz/order"
		}
	});

	require(["angular", "base"], function(angular, base) {
        /*if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
            document.write("请使用webkit内核浏览器登录");
            return;
        }*/
		angular.bootstrap(document, ["ngView"]);
	});
	
})(require, define);