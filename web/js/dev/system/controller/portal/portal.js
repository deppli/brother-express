define(["thenjs"], function(then) {
	return [["BusinessCtrl", ["$scope", "$rootScope", "$remote", "$modal",
	function($scope, $rootScope, $remote, $modal) {
        console.log("业务介绍");
	}]], ["PolicyCtrl", ["$scope", "$rootScope", "$remote", "$modal",
    function ($scope, $rootScope, $remote, $modal) {
        console.log("海关条例");
    }]], ["CompanyCtrl", ["$scope", "$rootScope", "$remote", "$modal",
    function ($scope, $rootScope, $remote, $modal) {
        console.log("公司简介");
        $scope.myInterval = 5000;
        var slides = $scope.slides = [];
        $scope.addSlide = function() {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                image: 'http://placekitten.com/' + newWidth + '/300',
                text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
            });
        };
        for (var i=0; i<4; i++) {
            $scope.addSlide();
        }
    }]], ["ContactCtrl", ["$scope", "$rootScope", "$remote", "$modal",
    function ($scope, $rootScope, $remote, $modal) {
        console.log("联系方式");
    }]], ["ToolsCtrl", ["$scope", "$rootScope", "$remote", "$modal",
    function ($scope, $rootScope, $remote, $modal) {
        console.log("辅助工具");
    }]]];
});