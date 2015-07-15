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
            "angular-qrcode": {
                deps: ["qrcode-base", "qrcode-utf8", "angular"]
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
            },
            'bootstrap-icheck': {
                deps: ["jquery"]
            },
            'qrcode-utf8':{
                deps:["qrcode-base"]
            },
            'downloadify':{
                deps:["swfobject"]
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
            "angular-qrcode": "lib/angular-qrcode/qrcode",
            "qrcode-base": "lib/angular-qrcode/qrcode-base",
            "qrcode-utf8": "lib/angular-qrcode/qrcode-utf8",
            "cryptojs-core": "lib/crypto/build/components/core-min",
            "cryptojs-hmac": "lib/crypto/build/components/hmac-min",
            "cryptojs-sha256": "lib/crypto/build/components/sha256-min",
            xlsx: "lib/xlsx/dist/xlsx.core.min",
            "excel-builder": "lib/excel-builder/dist/excel-builder.compiled.min",
            "swfobject": "lib/downloadify/js/swfobject",
            "downloadify": "lib/downloadify/js/downloadify.min",
            thenjs: "lib/thenjs/then.min",
            "bootstrap-icheck": "lib/bootstrap-icheck/icheck.min",
            "iscroll": "lib/iscroll-master/build/iscroll",

            common: "public/common",
            service: "public/service",
            component: "public/component",
            dict: "public/dict",
            config: "public/config",
            /**
             * angular module
             */
            base: "manage/module/base",

            /**
             * controller
             */
            settings: "manage/controller/basic/settings",
            news: "manage/controller/basic/news",
            customer: "manage/controller/customer/customer",
            group: "manage/controller/basic/group",
            user: "manage/controller/basic/user",
            order: "manage/controller/order/order",
            orderBatch: "manage/controller/order/orderBatch"
        },
        waitSeconds: 0
    });

    require(["angular", "base"], function(angular, base) {
        /*if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
            document.write("请使用webkit内核浏览器登录");
            return;
        }*/
        angular.bootstrap(document, ["ngView"]);
    });

})(require, define);