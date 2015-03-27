define(["thenjs"], function(then) {
	return [["OrderCtrl", ["$scope", "$rootScope", "$remote", "$modal",
	function($scope, $rootScope, $remote, $modal) {
        $scope.STEP = 1;
        window.scope = $scope;

        $scope.nextStep = function(){
            $scope.STEP++;
        }

        $scope.preStep = function(){
            $scope.STEP--;
        }
	}]]];
});