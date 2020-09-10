var http = require("http");
var https = require("https");
var fs = require("fs");
var cheerio = require("cheerio");
var path = "./public/news";
function createImgs(cb){
    fs.readdir(path,function(err, files){
        if(err){
            throw new Error(err)
        } else{
            getUrl(files,cb)
        }
    })
}

function getUrl(files,cb){
    files.forEach(function(item, index){
        fs.readFile(path + '/' +item , 'utf-8', function(err, html){
            if(err){
                console.log(err);
            } else{
                var $ = cheerio.load(html);
                var url = $('img').eq(0).attr('src');
                if(url){
                    var suffix = url.substr(url.lastIndexOf('.'));
                    getImg({url:url, name: (index + 1) + suffix})
                }
            }
        })
    })
    cb({code: 1, msg: '图片下载完成'})
}

function getImg(imgObj){
    var url = !/http/g.test(imgObj.url) ? 'https:' + imgObj.url : imgObj.url;

    if(/https/g.test(url)){
        https.get(url, function(res){
            var imgData = "";

            res.setEncoding("binary"); //设置response的编码为binary,否则图片打不开

            res.on("data", function(chunk){
                imgData += chunk
            });

            res.on("end", function(){
                downImg(imgObj.name,imgData)
            });
        });
    } else {
        http.get(url, function(res){
            var imgData = "";

            res.setEncoding("binary"); //设置response的编码为binary,否则图片打不开

            res.on("data", function(chunk){
                imgData += chunk
            });

            res.on("end", function(){
                downImg(imgObj.name,imgData)
            });
        });
    }
}


function downImg(name, data) {
    fs.writeFile("./public/images/" + name, data, "binary", function(err){
        if(err){
            console.log(err);
        }
        console.log("图片下载成功");
    });
}

module.exports = createImgs













