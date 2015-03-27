define(["thenjs"], function(then) {
    return [["SettingsCtrl", ["$scope", "$rootScope", "$remote", "$modal", "$scopeData", "$config", "$constants",
        function($scope, $rootScope, $remote, $modal, $scopeData, $config, $constants) {
            $scope.listSettings = function(){
                $remote.post("/service/listSettings", null, function (data) {
                    $scope.Params = data;
                    console.log(data);
                });
            }

            $scope.saveSettings = function(){
                var postData = {
                    settings: $scope.Params
                }
                $remote.post("/service/updateSettings", postData, function (data) {
                    var msg = {text:$constants.MESSAGE_SUCCESS_SETTINGS_UPDATE};
                    $scope.showMessage(msg);
                });
            }

            $scope.listSettings();
        }]]]
});