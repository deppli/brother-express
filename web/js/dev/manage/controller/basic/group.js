define(["thenjs","bootstrap-icheck"], function(then) {
    return [["GroupCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$constants",
        function($scope, $rootScope, $remote, $modal, $scopeData, $constants) {

            $scope.listGroup = function(){
                $remote.post("/group/list", null, function(data){
                    $scope.GroupList = data;
                });
            }

            $scope.selectGroup = function(item, index){
                if($scope.selectedGroup){
                    if($scope.selectedGroup.index == index){
                        $scope.selectedGroup = null;
                    }else{
                        $scope.selectedGroup = item;
                        $scope.selectedGroup.index = index;
                    }
                }else{
                    $scope.selectedGroup = item;
                    $scope.selectedGroup.index = index;
                }
            }

            $scope.detailGroup = function(){
                if($scope.selectedGroup){
                    $remote.post("/service/listMenus", null, function(menu){
                        var postData = {
                            id: $scope.selectedGroup._id
                        }

                        $remote.post("/group/detail", postData, function(data){
                            $scope.Group = data;
                            menu.forEach(function(menuItem){
                                $scope.Group.menu.forEach(function(selfItem){
                                    if(menuItem.id == selfItem.id){
                                        menuItem.checked = "checked";
                                        return;
                                    }
                                });
                                if(menuItem.subMenu){
                                    menuItem.subMenu.forEach(function(subItem){
                                        $scope.Group.menu.forEach(function(selfItem){
                                            if(subItem.id == selfItem.id){
                                                subItem.checked = "checked";
                                                return;
                                            }
                                        });
                                    });
                                }
                            });
                            $scope.EditMenu = menu;

                            $scope.detailModal();
                        });
                    });
                }
            }

            $scope.deleteGroup = function(){
                if($scope.selectedGroup){
                    var postData = {
                        id: $scope.selectedGroup._id
                    }
                    $scope.selectedGroup = null;

                    var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_DEL_GROUP, confCallback:function(){
                        $remote.post("/group/delete", postData, function(data){
                            $scope.listGroup();
                        });
                    }};
                    $scope.showMessage(msg);

                }
            }

            $scope.newModal = function(){
                $remote.post("/service/listMenus", null, function(data){
                    $scope.Menu = data;
                    var modalNew = $modal.open({
                        templateUrl: 'addGroup',
                        controller: 'NewGroupCtrl',
                        size: "lg",
                        scope: $scope
                    });
                });
            }

            $scope.detailModal = function(){
                var modalDetail = $modal.open({
                    templateUrl: 'editGroup',
                    controller: 'EditGroupCtrl',
                    size: "lg",
                    scope: $scope
                });
            }

            $scope.listGroup();

            }]
        ],
        ["NewGroupCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$constants",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $constants) {
                $scope.newGroup = function(){
                    if($scope.checkForm($scope.addGroupForm)){
                        var menus = $scope.checkMenu($scope.Menu);

                        var postData = {
                            name: $scope.GroupName||"",
                            description: $scope.GroupDescription||"",
                            menu: menus
                        }

                        $remote.post("/group/add", postData, function(data){
                            $modalInstance.close();
                            var msg = {text:$constants.MESSAGE_SUCCESS_NEW_GROUP};
                            $scope.showMessage(msg);
                            $scope.listGroup();
                        });
                    }
                }
            }]
        ],
        ["EditGroupCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData) {
                $scope.editGroup = function(){

                    var menus = $scope.checkMenu($scope.EditMenu);

                    var postData = {
                        id: $scope.Group._id,
                        name: $scope.Group.name||"",
                        description: $scope.Group.description||"",
                        menu: menus
                    }

                    $remote.post("/group/edit", postData, function(data){
                        $modalInstance.close();
                        $scope.listGroup();
                    });
                }
            }]
        ]];
});