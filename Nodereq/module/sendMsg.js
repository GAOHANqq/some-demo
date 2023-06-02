const SMSClient = require('@alicloud/sms-sdk');
const accessKeyId = '' 
const secretAccessKey = ''

function getCode(){
    let code = new Array(6).fill(1).map(()=>{
        return parseInt(Math.random()*10)
    }).toString().replace(/,/g,'')
    return {code}
}

function sendMsg(cb){
    //初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: '18855031615',//必填:支持以逗号分隔的形式批量调用，上限为1000个,发送国际/港澳台消息时格式为：国际区号+号码，如“85200000000”
        SignName: '爱心小站',//必填:短信签名
        TemplateCode: 'SMS_205407003',//必填:短信模板
        TemplateParam: JSON.stringify(getCode())//可选:模板内容为"亲爱的${name},您的验证码为${code}"时。
    }).then( (res)=> {
        cb&&cb(res)
    },  (err) =>{
        cb&&cb(err)
    })
}
module.exports = sendMsg
