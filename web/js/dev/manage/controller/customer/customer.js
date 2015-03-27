define(["thenjs", "cryptojs-sha256", "bootstrap-icheck"], function(then, crypto) {
    return [["CustomerCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$config", "$constants",
        function($scope, $rootScope, $remote, $modal, $scopeData, $config, $constants) {

            var sexArr = $scope.initOptions("Sex");
            $scope.SexList = sexArr[0];

            $scope.listCustomer = function(){
                $remote.post("/customer/list", null, function(data){
                    $scope.CustomerList = data;
                });
            }

            $scope.selectCustomer = function(item, index){
                if($scope.selectedCustomer){
                    if($scope.selectedCustomer.index == index){
                        $scope.selectedCustomer = null;
                    }else{
                        $scope.selectedCustomer = item;
                        $scope.selectedCustomer.index = index;
                    }
                }else{
                    $scope.selectedCustomer = item;
                    $scope.selectedCustomer.index = index;
                }
            }

            $scope.detailCustomer = function(){
                if($scope.selectedCustomer){
                    var postData = {
                        id: $scope.selectedCustomer._id
                    }

                    $remote.post("/customer/detail", postData, function(data){
                        $scope.Customer = data;
                        $scope.detailModal();
                    });
                }
            }

            $scope.deleteCustomer = function(){
                if($scope.selectedCustomer){
                    var postData = {
                        id: $scope.selectedCustomer._id
                    }
                    $scope.selectedCustomer = null;

                    var msg = {type:$constants.MESSAGE_DIALOG_TYPE_CONF, text:$constants.MESSAGE_CONF_DEL_USER, confCallback:function(){
                        $remote.post("/customer/delete", postData, function(data){
                            $scope.listCustomer();
                        });
                    }};
                    $scope.showMessage(msg);
                }
            }

            $scope.lockCustomer = function(){
                if($scope.selectedCustomer){
                    var postData = {
                        id: $scope.selectedCustomer._id
                    }
                    $scope.selectedCustomer = null;

                    $remote.post("/customer/lock", postData, function(data){
                        $scope.listCustomer();
                    });
                    $scope.showMessage(msg);
                }
            }

            $scope.unlockCustomer = function(){
                if($scope.selectedCustomer){
                    var postData = {
                        id: $scope.selectedCustomer._id
                    }
                    $scope.selectedCustomer = null;

                    $remote.post("/customer/unlock", postData, function(data){
                        $scope.listCustomer();
                    });
                }
            }

            $scope.newModal = function(){
                var modalNew = $modal.open({
                    templateUrl: 'addCustomer',
                    controller: 'NewCustomerCtrl',
                    size: "lg",
                    scope: $scope
                });
            }

            $scope.detailModal = function(){
                var modalDetail = $modal.open({
                    templateUrl: 'editCustomer',
                    controller: 'EditCustomerCtrl',
                    size: "lg",
                    scope: $scope
                });
            }

            $scope.listCustomer();
        }]
    ],
        ["NewCustomerCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config) {
                $scope.CustomerSex = $scope.SexList[0];

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.newCustomer = function(){
                    var password = crypto.SHA256($scope.CustomerPassword).toString();
                    var encPassword = crypto.HmacSHA256(password, $config.encrySeed).toString();
                    var postData = {
                        loginId: $scope.CustomerLoginId||"",
                        password : encPassword,
                        nickname: $scope.CustomerNickname||"",
                        name: $scope.CustomerName||"",
                        sex: $scope.CustomerSex.key||0,
                        idNo: $scope.CustomerIdNo|"",
                        birthday: $scope.CustomerBirthday||"",
                        phone: $scope.CustomerPhone||"",
                        email: $scope.CustomerEmail||"",
                        address: $scope.CustomerAddress||""
                    }

                    $remote.post("/customer/add", postData, function(data){
                        $modalInstance.close();
                        $scope.listCustomer();
                    });
                }
            }]
        ],
        ["EditCustomerCtrl", ["$scope", "$rootScope", "$remote", "$modalInstance", "$scopeData", "$config",
            function($scope, $rootScope, $remote, $modalInstance, $scopeData, $config) {
                var result = $scope.initOptions("Sex", $scope.Customer.sex);
                $scope.SexList = result[0];
                $scope.Customer.sex = $scope.SexList[result[1]];

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.checkPassword = function(){
                    $scope.CheckPassword = true;
                }

                $scope.editCustomer = function(){
                    var postData = {
                        id: $scope.selectedCustomer._id,
                        nickname:$scope.Customer.nickname||"",
                        name: $scope.Customer.name||"",
                        sex: $scope.Customer.sex.key||0,
                        idNo: $scope.Customer.idNo||"",
                        birthday: $scope.Customer.birthday||"",
                        phone: $scope.Customer.phone||"",
                        email: $scope.Customer.email||"",
                        address: $scope.Customer.address||""
                    }
                    if($scope.CheckPassword && $scope.EditPassword){
                        var password = crypto.SHA256($scope.EditPassword).toString();
                        var encPassword = crypto.HmacSHA256(password, $config.encrySeed).toString();
                        postData.password = encPassword;
                    }

                    $remote.post("/customer/edit", postData, function(data){
                        $modalInstance.close();
                        $scope.listCustomer();
                    });
                }
            }]
        ]];
});