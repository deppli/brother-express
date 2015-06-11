define(["cryptojs-sha256","thenjs"], function(crypto, then) {
	return [["RegCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$upload", "$constants", "$config", "$location",
	function($scope, $rootScope, $remote, $modal, $upload, $constants, $config, $location) {
        $scope.STEP = 1;

        $scope.initData = function(){
            $scope.idNo = 32019201102;
            $scope.loginId = "zhanghuan@annlover.com";
            $scope.name = "测试";
            $scope.nickname = "天逸江湖远";
            $scope.phone = "13872888911";
            $scope.address = "上海市长宁区凯旋路";
            $scope.password = "spdb1234";
            $scope.confPassword = "spdb1234";
            $scope.STEP = 1;
        }

        //$scope.initData();

        $scope.getAmtTicket = function(){
            var postData = {
                paramsId: "0B001"
            }

            $remote.post("/service/getSettings", postData, function(data){
                $scope._amtTicket = data.paramsValue;
            }, function(){
                var msg = {text:$constants.MESSAGE_FILE_AMTTICKET_EMPTY};
                $scope.showMessage(msg);
            });
        }
        $scope.getAmtTicket();

        var sex = $scope.initOptions("Sex")
        $scope.SexList = sex[0];
        $scope.sex = $scope.SexList[0];

        $scope.checkLoginId = function(){
            $scope.exist = false;
            if($scope.loginId){
                var postData = {
                    loginId: $scope.loginId
                }

                $remote.post("/service/checkCustomer", postData, function(data){
                },function(data){
                    $scope.exist = true;
                });
            }
        };

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
                        url: '/service/upload?type=1&file=' + $scope.loginId + $scope.idNo + '_A',
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressA.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressA.dynamic = 100;
                        $scope.idAUrl = $config.idCardPath + $scope.loginId + $scope.idNo + '_A.jpg'
                    });
                }
            }
        });

        /*$scope.$watch("idImgB", function(){
            var file = $scope.idImgB;
            if(file) {
                $scope.ProgressB = {};
                $scope.idBUrl = null;
                if(file[0].size > $config.maxIdFileSize) {
                    var msg = {text: $constants.MESSAGE_FILE_TOO_BIG};  //200K
                    $scope.showMessage(msg);
                }else{
                    $upload.upload({
                        url: '/service/upload?type=1&file=' + $scope.loginId + $scope.idNo + '_B',
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressB.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressB.dynamic = 100;
                        $scope.idBUrl = $config.idCardPath + $scope.loginId + $scope.idNo + '_B.jpg'
                    });
                }
            }
        });*/

        $scope.nextStep = function(step){
            switch(step){
                case 1:
                    if($scope.checkForm($scope.customerBasic)){
                        var postData = {
                            loginId: $scope.loginId
                        }
                        $remote.post("/service/sendMail", postData, function(data){
                            $scope.STEP++;
                        });
                    }
                    break;
                case 2:
                    $remote.post("/service/checkValidateEmail", null, function(data){
                        $scope.STEP++;
                    });
                    break;
                case 3:
                    if($scope.idAUrl && $scope.idBUrl){
                        var password = crypto.SHA256($scope.password).toString();
                        var encPassword = crypto.HmacSHA256(password, $config.encrySeed).toString();
                        var postData = {
                            loginId: $scope.loginId,
                            password : encPassword,
                            nickname: $scope.nickname||"",
                            name: $scope.name||"",
                            sex: $scope.sex.key||0,
                            idNo: $scope.idNo||"",
                            idNoImgA: $scope.idAUrl,      //.jpg
                            //idNoImgB: $scope.idBUrl,      //.jpg
                            birthday: $scope.birthday||"",
                            phone: $scope.phone||"",
                            address: $scope.address||""
                        }
                        $remote.post("/service/addCustomer", postData, function(data){
                            $scope.STEP++
                            $scope.balance = data.balance;
                        });
                    }else{
                        var msg = {text:$constants.MESSAGE_MUST_UPLOAD_IDNO};
                        $scope.showMessage(msg);
                    }
                    break;
                case 4:
                    $location.path('welcome');
                    //TODO add User
                    break;
            }
        }

        $scope.preStep = function(){
            $scope.STEP--;
        }
	}]]];
});