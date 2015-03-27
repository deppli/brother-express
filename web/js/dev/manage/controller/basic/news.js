define(["thenjs", "cryptojs-sha256", "bootstrap-icheck"], function(then, crypto) {
    return [["NewCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$config", "$constants",
        function($scope, $rootScope, $remote, $modal, $scopeData, $config, $constants) {

            $scope.listNew = function(){
                $remote.post("/news/list", null, function(data){
                    $scope.NewList = data;
                });
            }

            $scope.selectNew = function(item, index){
                if($scope.selectedNew){
                    if($scope.selectedNew.index == index){
                        $scope.selectedNew = null;
                    }else{
                        $scope.selectedNew = item;
                        $scope.selectedNew.index = index;
                    }
                }else{
                    $scope.selectedNew = item;
                    $scope.selectedNew.index = index;
                }
            }

            $scope.detailNew = function(){
                if($scope.selectedNew){
                    var postData = {
                        id: $scope.selectedNew._id
                    }

                    $remote.post("/news/detail", postData, function(data){
                        $scope.New = data;
                        $scope.detailModal();
                    });
                }
            }

            $scope.deleteNew = function(){
                if($scope.selectedNew){
                    var postData = {
                        id: $scope.selectedNew._id
                    }
                    $scope.selectedNew = null;

                    var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_DEL_NEW, confCallback:function(){
                        $remote.post("/news/delete", postData, function(data){
                            $scope.listNew();
                        });
                    }};
                    $scope.showMessage(msg);
                }
            }

            $scope.newModal = function(){
                var modalNew = $modal.open({
                    templateUrl: 'addNew',
                    controller: 'AddNewCtrl',
                    size: "lg",
                    scope: $scope
                });
            }

            $scope.detailModal = function(){
                var modalDetail = $modal.open({
                    templateUrl: 'editNew',
                    controller: 'EditNewCtrl',
                    size: "lg",
                    scope: $scope
                });
            }

            $scope.listNew();
        }]
    ],
        ["AddNewCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config) {
                var type = $scope.initOptions("NewType");
                $scope.NewTypeList = type[0];
                $scope.NewType = $scope.NewTypeList[type[1]];

                var display = $scope.initOptions("NewDisplayType");
                $scope.NewDisplayTypeList = display[0];
                $scope.NewDisplayType = $scope.NewDisplayTypeList[display[1]];

                $scope.openBeginDate = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.openedBeginDate = true;
                };

                $scope.openEndDate = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.openedEndDate = true;
                };

                $scope.addNew = function(){

                    if($scope.checkForm($scope.addNewForm)){
                        var postData = {
                            type: $scope.NewType.key||0,
                            title: $scope.NewTitle||"",
                            content: $scope.NewContent||"",
                            creater: $scope.backInfo._id,
                            beginDate: $scope.NewBeginDate||null,
                            endDate: $scope.NewEndDate||null,
                            displayType: $scope.NewDisplayType.key||0
                        }

                        $remote.post("/news/add", postData, function(data){
                            $modalInstance.close();
                            $scope.listNew();
                        });
                    }
                }
            }]
        ],
        ["EditNewCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config) {
                var type = $scope.initOptions("NewType", $scope.New.type);
                $scope.NewTypeList = type[0];
                $scope.New.type = $scope.NewTypeList[type[1]];

                var display = $scope.initOptions("NewDisplayType", $scope.New.displayType);
                $scope.NewDisplayTypeList = display[0];
                $scope.New.displayType = $scope.NewDisplayTypeList[display[1]];

                $scope.openBeginDate = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.openedBeginDate = true;
                };

                $scope.openEndDate = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.openedEndDate = true;
                };

                $scope.editNew = function(){
                    if($scope.checkForm($scope.editNewForm)){
                        var postData = {
                            id: $scope.selectedNew._id,
                            type: $scope.New.type.key||0,
                            title: $scope.New.title||"",
                            content: $scope.New.content||"",
                            beginDate: $scope.New.beginDate,
                            endDate: $scope.New.endDate,
                            displayType: $scope.New.displayType.key||0
                        }

                        $remote.post("/news/edit", postData, function(data){
                            $modalInstance.close();
                            $scope.listNew();
                        });
                    }
                }
            }]
        ]];
});