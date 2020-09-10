var fs = require("fs");
var http = require("http");

var path = './public/images'

function loadImg(cb){
    fs.readdir(path,function(err, files){
        if(err){
            cb({code:0, msg: '请求失败', data: []})
        } else{
            /*
            // 网络加载
            http.createServer(function (req, res) {

                //第一种
                 fs.createReadStream(path+ '/' + files[0]).pipe(res)
                //第二种

                // fs.readFile(path+ '/' + files[0],function (err,data) {
                //     if (err) {
                //         res.end('图片不存在')
                //     }
                //     else {
                //         res.writeHeader(200,{'Context-Type':'text/html'})
                //         res.end(data)
                //     }
                // })
            }).listen(3001)

            */
            cb({code:1, msg: '请求成功', data: files, path: path})
        }
    })
}

module.exports = loadImg













