var fs = require('fs');

var model = require("./model"),
    provincesModel = model.Provinces,
    citysModel = model.Citys,
    areasModel = model.Areas;

fs.readFile('sql_province.txt', 'utf8', function (err, data) {
    if (err) throw err;
    var noQuate = data.replace(/\'/g,"")
    var dataArr = noQuate.split('\n');
    var dbData = [];
    dataArr.forEach(function(each){
        var final = {};
        var data = each.substring(1, each.length - 2)
        var noBlank = data.replace(/ /g,"");
        var oneArr = noBlank.split(',');
        //console.log(oneArr)
        final.seq = oneArr[0];
        final.provinceId = oneArr[1];
        final.provinceName = oneArr[2];
        dbData.push(final);
        new provincesModel(final).save(function(err, doc) {
            console.log(doc)
        });
    });
});

fs.readFile('sql_city.txt', 'utf8', function (err, data) {
    if (err) throw err;
    //console.log(data);
    var noQuate = data.replace(/\'/g,"")
    var dataArr = noQuate.split('\n');
    var dbData = [];
    dataArr.forEach(function(each){
        var final = {};
        var data = each.substring(1, each.length - 2)
        var noBlank = data.replace(/ /g,"");
        var oneArr = noBlank.split(',');
        //console.log(oneArr)
        final.seq = oneArr[0];
        final.cityId = oneArr[1];
        final.cityName = oneArr[2];
        final.provinceId = oneArr[3];
        new citysModel(final).save(function(err, doc) {
            console.log(doc)
        });
        //dbData.push(final);
    });
    //console.log(dbData);
});

fs.readFile('sql_area.txt', 'utf8', function (err, data) {
    if (err) throw err;
    //console.log(data);
    var noQuate = data.replace(/\'/g,"")
    var dataArr = noQuate.split('\n');
    var dbData = [];
    dataArr.forEach(function(each){
        var final = {};
        var data = each.substring(1, each.length - 2)
        var noBlank = data.replace(/ /g,"");
        var oneArr = noBlank.split(',');
        //console.log(oneArr)
        final.seq = oneArr[0];
        final.areaId = oneArr[1];
        final.areaName = oneArr[2];
        final.cityId = oneArr[3];
        new areasModel(final).save(function(err, doc) {
            console.log(doc)
        });
        //dbData.push(final);
    });
    //console.log(dbData);
});