define(["angular","service"], function(angular) {
	angular.module('ngComponent', ["ngService"])
    .directive("ngNav", function(){
        return function(scope, element, attrs) {

            var nav = attrs.ngNav;

            element.bind("click", function(){
                $(nav).toggleClass("in");
            })

            $("#content").bind("click", function(){
                $(nav).removeClass("in");
            })

            $(".footer").bind("click", function(){
                $(nav).removeClass("in");
            })

            $("#navbar").bind("click", function(){
                $(nav).removeClass("in");
            })
        }
    })
    .directive("ngIcheck", function($compile){
        return function(scope, element, attrs) {

            var role = attrs.ngIcheck;

            if(scope[role] && scope[role]["checked"]){
                $(element).iCheck('check');
            }

            jQuery(element).on('ifChecked', function(event){
                scope[role]["checked"] = "checked";
            });

            jQuery(element).on('ifUnchecked', function(event){
                scope[role]["checked"] = null;
            });

            jQuery(element).iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        }
    })
    .directive("ngIradio", function($compile){
        return function(scope, element, attrs) {

            var role = attrs.name;
                var loop = attrs.loop;

                if(loop){
                    if(scope[role] == scope[attrs.ngIradio]){
                        $(element).iCheck('check');
                    }
                    jQuery(element).on('ifChecked', function(event){
                        scope[role] = element.val();
                    scope.$apply();
                    });

                }else{
            if(scope.$parent[role] == eval("scope." + attrs.ngIradio)){
                $(element).iCheck('check');
            }

            jQuery(element).on('ifChecked', function(event){
                scope.$parent[role] = element.val();
                    scope.$parent.$apply();
            });

                }
            jQuery(element).iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });

        }
    })
    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                    console.log(img.src);
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
});