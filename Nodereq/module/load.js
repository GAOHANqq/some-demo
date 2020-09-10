var getData = require("./getData");
var https = require("https");
var cheerio = require("cheerio");
var fs = require("fs");

function load(callback){
    getData(function(data){
        data.forEach(function(item, index){
            var html = "";
            if( item.isHttps ){
                https.get(item.url ,function(res){
                    res.setEncoding("utf-8");

                    res.on("data", function(chunk){
                        html += chunk;
                    });

                    res.on("end", function(){
                        var $ = cheerio.load(html);
                        var con = $("#signals").html();
                        fs.writeFile(`./public/news/${index+1}.html`, con ,function(err){
                            if( err ){ throw err}
                            console.log(`新闻${index}写入成功`)
                        })
                    });
                }).on("error", function(e){
                    console.log(`错误:${e.message}`);
                });
            }

        });
        callback({code:1, data: data, msg: '数据抓取完毕'});
    })
}
module.exports = load;