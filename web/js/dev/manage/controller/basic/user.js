define(["thenjs", "cryptojs-sha256", "bootstrap-icheck"], function(then, crypto) {
    return [["UserCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$config", "$constants",
        function($scope, $rootScope, $remote, $modal, $scopeData, $config, $constants) {

            var sexArr = $scope.initOptions("Sex");
            $scope.SexList = sexArr[0];

            $scope.listUser = function(){
                $remote.post("/user/list", null, function(data){
                    $scope.UserList = data;
                });
            }

            $scope.selectUser = function(item, index){
                if($scope.selectedUser){
                    if($scope.selectedUser.index == index){
                        $scope.selectedUser = null;
                    }else{
                        $scope.selectedUser = item;
                        $scope.selectedUser.index = index;
                    }
                }else{
                    $scope.selectedUser = item;
                    $scope.selectedUser.index = index;
                }
            }

            $scope.detailUser = function(){
                if($scope.selectedUser){
                    var postData = {
                        id: $scope.selectedUser._id
                    }

                    $remote.post("/user/detail", postData, function(data){
                        $scope.User = data;
                        $scope.EditGroup = $scope.User.group._id;

                        $remote.post("/group/list", null, function(group){
                            $scope.Group = group;
                            $scope.detailModal();
                        });

                    });
                }
            }

            $scope.deleteUser = function(){
                if($scope.selectedUser){
                    var postData = {
                        id: $scope.selectedUser._id
                    }
                    $scope.selectedUser = null;

                    var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_DEL_USER, confCallback:function(){
                        $remote.post("/user/delete", postData, function(data){
                            var msg = {text:$constants.MESSAGE_SUCCESS_DEL_USER};
                            $scope.showMessage(msg);
                            $scope.listUser();
                        });
                    }};
                    $scope.showMessage(msg);
                }
}

            $scope.lockUser = function(){
                if($scope.selectedUser){
                    var postData = {
                        id: $scope.selectedUser._id
                    }
                    $scope.selectedUser = null;

                    var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_LOCK_USER, confCallback:function(){
                        $remote.post("/user/lock", postData, function(data){
                            var msg = {text:$constants.MESSAGE_SUCCESS_LOCK_USER};
                            $scope.showMessage(msg);
                            $scope.listUser();
                        });
                    }};
                    $scope.showMessage(msg);
                }
            }

            $scope.unlockUser = function(){
                if($scope.selectedUser){
                    var postData = {
                        id: $scope.selectedUser._id
                    }
                    $scope.selectedUser = null;

                    $remote.post("/user/unlock", postData, function(data){
                        var msg = {text:$constants.MESSAGE_SUCCESS_UNLOCK_USER};
                        $scope.showMessage(msg);
                        $scope.listUser();
                    });
                }
            }

            $scope.newModal = function(){
                $remote.post("/group/list", null, function(data){
                    $scope.Group = data;
                    var modalNew = $modal.open({
                        templateUrl: 'addUser',
                        controller: 'NewUserCtrl',
                        size: "lg",
                        scope: $scope
                    });
                });
            }

            $scope.detailModal = function(){
                var modalDetail = $modal.open({
                    templateUrl: 'editUser',
                    controller: 'EditUserCtrl',
                    size: "lg",
                    scope: $scope
                });
            }

            $scope.listUser();
        }]
    ],
        ["NewUserCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config", "$constants",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config, $constants) {
                $scope.UserSex = $scope.SexList[0];

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.newUser = function(){

                    if($scope.checkForm($scope.addUserForm)){
                        var password = crypto.SHA256($scope.Password).toString();
                        var encPassword = crypto.HmacSHA256(password, $config.encrySeed).toString();

                        var postData = {
                            loginId: $scope.LoginId||"",
                            password: encPassword,
                            name: $scope.UserName||"",
                            sex: $scope.UserSex.key,
                            idNo: $scope.UserIdNo||"",
                            birthday: $scope.UserBirthday||"",
                            phone: $scope.UserPhone||"",
                            email: $scope.UserEmail||"",
                            address: $scope.UserAddress||"",
                            group: $scope.UserGroup||""
                        }

                        $remote.post("/user/add", postData, function(data){
                            $modalInstance.close();
                            var msg = {text:$constants.MESSAGE_SUCCESS_NEW_USER};
                            $scope.showMessage(msg);
                            $scope.listUser();
                        });
                    }
                }
            }]
        ],
        ["EditUserCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config) {
                var result = $scope.initOptions("Sex", $scope.User.sex);
                $scope.SexList = result[0];
                $scope.User.sex = $scope.SexList[result[1]];

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.checkPassword = function(){
                    $scope.CheckPassword = true;
                }

                $scope.editUser = function(){
                    var postData = {
                        id: $scope.selectedUser._id,
                        name: $scope.User.name||"",
                        sex: $scope.User.sex.key,
                        idNo: $scope.User.idNo||"",
                        birthday: $scope.User.birthday||"",
                        phone: $scope.User.phone||"",
                        email: $scope.User.email||"",
                        address: $scope.User.address||"",
                        group: $scope.EditGroup||""
                    }
                    if($scope.CheckPassword && $scope.EditPassword){
                        var password = crypto.SHA256($scope.EditPassword).toString();
                        var encPassword = crypto.HmacSHA256(password, $config.encrySeed).toString();
                        postData.password = encPassword;
                    }

                    $remote.post("/user/edit", postData, function(data){
                        $modalInstance.close();
                        $scope.listUser();
                    });
                }
            }]
        ]];
});