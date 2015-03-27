define(["thenjs"], function(then) {
	return [["RegCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$upload", "$constants", "$config",
	function($scope, $rootScope, $remote, $modal, $upload, $constants, $config) {
        $scope.STEP = 3;
        $scope.idNo = 32019201102;
        window.scope = $scope;

        var sex = $scope.initOptions("Sex")
        $scope.SexList = sex[0];
        $scope.sex = $scope.SexList[0];

        $scope.checkLoginId = function(){
            $scope.exist = false;
            if($scope.loginId){
                var postData = {
                    loginId: $scope.loginId
                }

                $remote.post("/customer/check", postData, function(data){
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
                        url: '/service/upload?type=1&file=' + $scope.idNo + '.A',
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressA.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressA.dynamic = 100;
                        $scope.idAUrl = "/upload/idno/" + $scope.idNo + '.A.jpg'
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
                        url: '/service/upload?type=1&file=' + $scope.idNo + '.B',
                        file: file[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.ProgressB.dynamic = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.ProgressB.dynamic = 100;
                        $scope.idBUrl = "/upload/idno/" + $scope.idNo + '.B.jpg'
                    });
                }
            }
        });

        $scope.nextStep = function(step){
            switch(step){
                case 1:
                    var postData = {
                        loginId: $scope.loginId
                    }
                    $remote.post("/service/sendMail", postData, function(data){
                        $scope.STEP++;
                    });
                    break;
                case 2:
                    $remote.post("/service/checkValidateEmail", null, function(data){
                        $scope.STEP++;
                    });
                    break;
                case 3:
                    if($scope.idAUrl && $scope.idBUrl){
                        $scope.STEP++
                    }else{
                        var msg = {text:$constants.MESSAGE_MUST_UPLOAD_IDNO};
                        $scope.showMessage(msg);
                    }
                    break;
                case 4:
                    break;
            }
        }

        $scope.preStep = function(){
            $scope.STEP--;
        }
	}]]];
});