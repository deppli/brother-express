/**
 * Created by virgo on 2015/3/16.
 */
var http = require('http');

var qs = require('querystring');

var data = {
    cno: 610291500140161,
    cp: "65001"
};//这是需要提交的数据


var content = qs.stringify(data);
console.log(content);

var options = {
    hostname: "track.kuaidi.hk",
    port: 8089,
    path: '/cgi-bin/GInfo.dll?EmsApiTrack&ntype=+10000&',
    method: 'GET'
};

var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

req.end();

