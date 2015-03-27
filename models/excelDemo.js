var excel = require("node-xlsx"),
    then = require("thenjs");
var fs = require('fs');
var __dirname = "g:"
//var obj = excel.parse(__dirname + '/demo.xlsx');
//console.log(obj);
//console.log(obj[0].data);
//console.log(obj[1].data);

//读取文件
fs.readFile('g:/city', 'utf8', function (err, data) {
    if (err) throw err;
    //console.log(data);
    var dataArr = data.split('\n');
    var dbData = [];
    dataArr.forEach(function(each){
        var final = {};
        var oneArr = each.split('|');
        final.cityId = oneArr[0];
        final.cityName = oneArr[1];
        final.provinceId = oneArr[2];
        dbData.push(final);
    });
    console.log(dbData);
});

require('model')