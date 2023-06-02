const https = require("https");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const template = require('art-template');


//发送者邮箱SMTP账户
let emailAuth = {
    user: "1271448267@qq.com", //账号
    pass: "" // 授权码,不是密码
};
let emailInfo={
    service: 'qq',
    from: '1271448267@qq.com',
    to: '1271448267@qq.com',
    subject: '每日面对微笑的自己',
    html: ''
}

//墨迹天气当地拼音
const local = "inner-mongolia/bayannur";
// 墨迹天气地址
const weatherUrl = "https://tianqi.moji.com/weather/china/" + local;
function getWeateherData(){
    let promise = new Promise((resolve,reject)=>{
        https.get(weatherUrl,(res)=>{
            let html = ''
            res.setEncoding("utf-8");
            res.on("data", (chunk)=>{
                html += chunk
            });
            res.on("end", ()=>{
                let $ = cheerio.load(html);

                // 温暖提示
                let tip = "";
                $(".wea_tips").each((i, e)=> {
                    tip = $(e).find("em").text()
                });
                // 近三天天气
                let data = [];
                $(".forecast .days").each((i, e)=> {
                    let li = $(e).find("li");
                    data.push({
                        day: $(li[0]).text().replace(/\s/g, ""),
                        imgUrl: $(li[1]).find("img").attr("src"),
                        text: $(li[1]).text().replace(/\s/g, ""),
                        temperature: $(li[2]).text().replace(/\s/g, ""),
                        windDir: $(li[3]).find("em").text().replace(/\s/g, ""),
                        windLevel: $(li[3]).find("b").text().replace(/\s/g, "")
                    });
                });
                resolve({code: 1, data:{tip,data}, msg: '数据获取成功'})
            });
            res.on('error',(err)=>{
                reject({code: -1, data: '', msg: '数据获取失败'});
            })
        })
    })
    return promise
}
// 获取邮件html
function getHtml(){
    let promise = new Promise((resolve,reject)=>{
        fs.readFile(path.resolve('../template/email.html'), (err,res)=>{
            if( err ){
                console.log(err);
                reject(err)
                return
            }
            getWeateherData().then((data)=>{
                let today =  `${new Date().getFullYear()}年${new Date().getMonth()+1}月${new Date().getDate()}日`
                let tpl = template.render(res.toString(),{...data.data,today})
                resolve(tpl)
            })
        })
    })
    return promise
}
// 发送邮件
function start() {
    let promise = new Promise((resolve,reject)=>{
        console.log('开始');
        getHtml().then((html)=>{
            // 创建连接
            let transporter = nodemailer.createTransport({
                service: 'qq',
                auth: emailAuth,
                secureConnection: true, // 使用 SSL
                port: 465, // SMTP 端口
            });
            // 发送参数
            let mailOptions = {
                from: emailInfo.from,
                to: emailInfo.to,
                subject: emailInfo.subject,
                html
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    reject({code:-1, data: '', msg: error})
                    return
                }
                resolve({code:1, data: info.messageId, msg: '邮件发送成功'})
                console.log("等待目标时间...");
            });
        })
    })
    return promise
}

function sendEmail(time={hour:7,min:30}){
    // 设置定时器
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(1, 6)];
    rule.hour = time.hour;
    rule.minute = time.min;
    console.log("等待目标时间...");
    schedule.scheduleJob(rule, function() {
        console.log('设置计时:',time);
        start()
    });
}
sendEmail()
module.exports = sendEmail

// TODO
// 备忘录自动提示
// 输入时间,要做的事,在规定时间自动发送
// 发送后12小时自动删除

