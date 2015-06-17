define(["thenjs"], function(then) {
	return [["BusinessCtrl", ["$scope", "$rootScope", "$remote", "$modal",
	function($scope, $rootScope, $remote, $modal) {
        $scope.entry = 1;
        $scope.area = 1;

        $scope.switch = function(index){
            $scope.entry = index;
            $(document).scrollTop(0);
        }

        $scope.goArea = function(index){
            $scope.area = index;
            $(document).scrollTop(0);
        }
        console.log("业务介绍");
	}]],["MsgCtrl", ["$scope", "$rootScope", "$remote", "$modal",
    function($scope, $rootScope, $remote, $modal) {
        console.log("最新公告");
	}]], ["QuestionsCtrl", ["$scope", "$rootScope", "$remote", "$modal",
    function ($scope, $rootScope, $remote, $modal) {
        console.log("常见问题");
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
    }]], ["LinksCtrl", ["$scope", "$rootScope", "$remote", "$modal",
    function ($scope, $rootScope, $remote, $modal) {
        console.log("合作伙伴");
        $scope.links = [
            {src: 1, name: "国美在线", link: "http://www.gome.com.cn/"},
            {src: 2, name: "一号店", link: "http://www.yhd.com"},
            {src: 3, name: "当当", link: "http://www.dangdang.com"},
            {src: 4, name: "易迅", link: "http://www.yixun.com"},
            {src: 5, name: "唯品会", link: "http://www.vip.com"},
            {src: 6, name: "天猫", link: "http://www.tmall.com"},
            {src: 7, name: "苏宁易购", link: "http://www.suning.com"},
            {src: 8, name: "聚美优品", link: "http://www.jumei.com"},
            {src: 9, name: "京东", link: "http://www.jd.com"},
            {src: 10, name: "淘宝", link: "http://www.taobao.com"},
            {src: 11, name: "韵达速递", link: "http://www.yundaex.com"},
            {src: 12, name: "申通快递", link: "http://www.sto.cn/"},
            {src: 13, name: "圆通速递", link: "http://www.yto.net.cn/"},
            {src: 14, name: "德邦物流", link: "http://www.deppon.com"},
            {src: 15, name: "宅急送", link: "http://www.zjs.com.cn"},
            {src: 16, name: "顺丰速递", link: "http://www.sf-express.com"},
            {src: 17, name: "TNT", link: "http://www.tnt.com"},
            {src: 18, name: "中国国际货运航空", link: "http://www.airchinacargo.com"},
            {src: 19, name: "Fedex", link: "http://www.fedex.com"},
            {src: 20, name: "EMS", link: "http://www.ems.com.cn"},
            {src: 21, name: "UPS", link: "http://www.ups.com"},
            {src: 22, name: "DHL", link: "http://www.dhl-usa.com"},
            {src: 23, name: "GUCCI", link: "http://www.gucci.com"},
            {src: 24, name: "沃尔玛", link: "http://www.walmart.com"},
            {src: 25, name: "iHerb", link: "http://www.iherb.com"},
            {src: 26, name: "CK", link: "http://www.calvinklein.cn"},
            {src: 27, name: "兰蔻", link: "http://www.lancome-usa.com"},
            {src: 28, name: "维多利亚", link: "https://www.victoriassecret.com/sale/"},
            {src: 29, name: "windeln", link: "http://www.windeln.de"},
            {src: 30, name: "kenzo", link: "https://www.kenzo.com/en/altair-beach"},
            {src: 31, name: "香奈儿", link: "http://www.chanel.com/en_US/fashion.html"},
            {src: 32, name: "Bluefly", link: "http://www.bluefly.com/"},
            {src: 33, name: "macys", link: "http://www.macys.com"},
            {src: 34, name: "ebay", link: "http://www.ebay.com/"},
            {src: 35, name: "亚马逊", link: "http://www.amazon.com/"},
            {src: 36, name: "萨克斯第五大道精品百货店", link: "http://www.saksfifthavenue.com/"},
            {src: 37, name: "Nordstrom", link: "http://nordstrom.polyvore.com/"},
            {src: 38, name: "overstock", link: "http://www.overstock.com/"},
            {src: 39, name: "vonmaur", link: "http://www.vonmaur.com/"},
            {src: 40, name: "bloomingdales", link: "http://www.bloomingdales.com/"},
            {src: 41, name: "costco", link: "http://www.costco.com/"},
            {src: 42, name: "kohls", link: "http://www.kohls.com/"},
            {src: 43, name: "neimanmarcus", link: "http://www.neimanmarcus.com/"},
            {src: 44, name: "rakuten", link: "http://www.rakuten.com/"}
        ];

        $scope.linksHT = [
            {src: 1, name: "RM返利网", link: "http://www.rebatesme.com//"},
            {src: 2, name: "美亚", link: "http://cn.topcashback.com/"},
            {src: 3, name: "EBATES", link: "http://www.ebates.cn/"},
            {src: 4, name: "EXTRABUX", link: "http://www.extrabux.com/"},
            {src: 5, name: "海淘IN", link: "http://www.haitaoin.com/"},
            {src: 6, name: "NB买", link: "http://www.nbmai.com/"},
            {src: 7, name: "最便宜", link: "http://www.nlzpy.com/"},
            {src: 8, name: "没得比", link: "http://www.meidebi.com/?orc=13.5"},
            {src: 9, name: "买手党", link: "http://www.maishoudang.com/"},
            {src: 10, name: "妈妈拜拜", link: "http://www.mombuybuy.com/"},
            {src: 11, name: "什么值得买", link: "http://www.smzdm.com/"},
            {src: 12, name: "买个便宜货", link: "http://www.mgpyh.com/"},
            {src: 13, name: "海淘无忧网", link: "http://www.ht51.com/"},
            {src: 14, name: "皮皮海淘", link: "http://www.npp.cc/"},
            {src: 15, name: "海倍网", link: "http://www.happay.com/"},
            {src: 16, name: "55海淘网", link: "http://www.55haitao.com/"},
            {src: 17, name: "海淘达人", link: "http://www.hter.cc/"},
            {src: 18, name: "6pm", link: "http://www.6pm.com/"},
            {src: 19, name: "极客海淘", link: "http://www.123haitao.com/"},
            {src: 20, name: "海淘之家", link: "http://www.haitaozj.com/"}
        ];
    }]]];
});