(function(require, define) {
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
            "angular-qrcode": {
                deps: ["qrcode-base", "qrcode-utf8", "angular"]
            },
            'qrcode-utf8':{
                deps:["qrcode-base"]
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
            "angular-qrcode": "lib/angular-qrcode/qrcode",
            "qrcode-base": "lib/angular-qrcode/qrcode-base",
            "qrcode-utf8": "lib/angular-qrcode/qrcode-utf8",
            thenjs: "lib/thenjs/then.min",

            common: "public/common",
            service: "public/service",
            component: "public/component",
            dict: "public/dict",
            config: "public/config",
            /**
             * angular module
             */
            base: "wechat/module/base"

            /**
             * controller
             */
        }
    });

    require(["angular", "base"], function(angular, base) {
        /*if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
         document.write("请使用webkit内核浏览器登录");
         return;
         }*/
        angular.bootstrap(document, ["ngView"]);
    });

})(require, define)