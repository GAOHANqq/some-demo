var http = require('http');
var cheerio = require('cheerio') // 解析字符串为html

var url = "http://sports.sina.com.cn/nba/1.shtml";

// 爬取页面
function netGet(callback){
    http.get(url, function(res){
        var html = "";
        // 设置发送过来数据的格式
        res.setEncoding("utf-8");
        // 拿到数据时
        res.on("data", function(chunk){
            html += chunk;
        });
        // 请求结束时
        res.on("end", function(){
            var $ = cheerio.load(html);
            var dataArr = [];

            // 获取链接
            $("#right a").each(function(){
                dataArr.push({url:$(this).attr('href'), name:$(this).text()});
            })
            callback(dataArr);
        });
    })
}
module.exports = netGet












