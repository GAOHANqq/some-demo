var https = require('https');
var cheerio = require('cheerio') // 解析字符串为html

var url = "https://www.zhibo8.cc";

// 爬取页面
function netGet(callback){
    https.get(url, function(res){
        var html = "";
        // 设置发送过来数据的格式
        res.setEncoding("utf-8");
        // 拿到数据时
        res.on("data", function(data){
            html += data;
        });
        // 请求结束时
        res.on("end", function(){
            var $ = cheerio.load(html);
            var dataArr = [];

            // 获取链接
            $("#recommend a").each(function(){
                var url = $(this).attr('href');
                var isHttps = /https/g.test(url);
                dataArr.push({url:url, name:$(this).text(),isHttps:isHttps });
            })
            callback(dataArr)
        });
    })
}
module.exports = netGet