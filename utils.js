const axios = require("axios")
const fs = require("fs")
const path = require('path')
const redis = require("redis")
const FormData = require("form-data")
const xml2js = require('xml2js');
const qiniu = require('qiniu')
const BASE_URL = "https://roseannepark.love/ins_img/"
const qiniu_key = "qnEmmhiadupBnhV8wBmqxnl9AQcizIKFZie1KxGS"
const qiniu_secret = "ctknfJo3FZw-P-Po5j_1mdtItrn79pJzlSwbKjkG"
const bucket = "rosenamepark"

const auth = new qiniu.auth.digest.Mac(qiniu_key, qiniu_secret)
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
let formUploader = new qiniu.form_up.FormUploader();

const uploadFile = (filePath,key)=>{
    // path.resolve(__dirname)
    console.log(path.resolve(__dirname))
    console.log(path.resolve(__filename))
    console.log(path.join(path.resolve(__dirname),filePath))
    let putExtra = new qiniu.form_up.PutExtra();
    const qiniu_options = {
        scope: bucket + ":" + key
    }
    const putPolicy = new qiniu.rs.PutPolicy(qiniu_options);
    let uploadToken = putPolicy.uploadToken(auth);
    formUploader.putFile(uploadToken,key,path.join(path.resolve(__dirname),filePath),putExtra,(respErr,respBody, respInfo)=>{
        console.log(respErr)
        console.log(respBody)
        console.log(respInfo)
    })
}

const builder = new xml2js.Builder({
    rootName: 'xml',
    cdata: true,
    headless: true,
});


const options = {
    hostname: 'api.weixin.qq.com',
    path: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx982e0268286fa910&secret=6ee8b5041bd13dfc8fd64aaf9d5d3921',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

// const request = new axios.Axios()

async function getToken() {
    let token = ""
    // let datas = fs.readFileSync("./token.txt",{
    //     encoding:"utf-8"
    // })
    // console.log(datas)
    let result = await client.get('token')
    console.log('result', result)
    if (result == null) {
        let result = await axios("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx982e0268286fa910&secret=6ee8b5041bd13dfc8fd64aaf9d5d3921")
        token = result.data.access_token;
        try{
            await client.set('token', token, {
                EX: 7200,
                NX: true
            })
        }catch(err){
            console.log('err',err)
            client.config('SET','slave-read-only','no')
            await client.set('token', token, {
                EX: 7200,
                NX: true
            })
        }
        // await client.sendCommand(['SET', 'token', token, ""])
    } else {
        token = result
    }
    return token
}

let client = null

async function initClient() {
    if (client != null) {
        return client
    }
    client = redis.createClient({
        url: 'redis://43.136.65.128:6379/1'
    });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();
    // client.ready()
    let ss = await client.get("10086")
    console.log(ss)
}



async function uploadMedia(filepath) {
    let path = "/home/rose_express/images/edge/" + filepath + '.jpg'
    let accounttoken = await getToken()
    const uploadUrl = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${accounttoken}`
    let datas = fs.readFileSync(path, {
    })

    const formData = new FormData();
    formData.append('media', datas, { filename: 'image.jpg' });
    formData.append('type', "image");

    let response = await axios.post(uploadUrl, formData, {
        headers: formData.getHeaders()
    })
    console.log(response.data)
    client.set(filepath, response.data.media_id, {
        EX: 259200,
        NX: true
    })
    return response.data.media_id;
}

// touser: '用户的OpenID',
//   msgtype: 'image',
//   image: {
//     media_id: '图片的Media ID'
//   }

function handleTextMessage(message, res) {
    // 构建回复消息的 XML
    const replyMessage = `
      <xml>
        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
        <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[链接：https://pan.baidu.com/s/1skar6MOey5_p6ma6Y5CIWQ?pwd=bjcr 提取码：bjcr 压缩包解压密码:rose]]></Content>
      </xml>
    `;

    // 回复用户消息
    console.log(replyMessage)
    res.set('Content-Type', 'application/xml');
    res.send(replyMessage);
}

function buildTextReply(message, content) {
    const replyMessage = {
        ToUserName: { '#cdata': message.FromUserName },
        FromUserName: { '#cdata': message.ToUserName },
        CreateTime: Math.floor(Date.now() / 1000),
        MsgType: { '#cdata': 'text' },
        Content: { '#cdata': content },
    };

    return builder.buildObject(replyMessage);
}

function buildImageReply(message, res) {
    const imageUrls = [
        'JHb3qVEOTH7RhfzCKcL1PVTwjkvHSbwsVPntsG-EbyfgVeB_E0Vuz3ixsknOtBR5',
        'JHb3qVEOTH7RhfzCKcL1PVTwjkvHSbwsVPntsG-EbyfgVeB_E0Vuz3ixsknOtBR5',
    ];

    const replyXmlArray = imageUrls.map((imageUrl) => {
        const replyMessage = {
            ToUserName: { '#cdata': message.FromUserName },
            FromUserName: { '#cdata': message.ToUserName },
            CreateTime: Math.floor(Date.now() / 1000),
            MsgType: { '#cdata': 'image' },
            Image: {
                MediaId: { '#cdata': imageUrl }, // 此处填写图片的 Media ID
            },
        };

        return builder.buildObject(replyMessage);
    });

    const replyXml = `<xml>${replyXmlArray.join('')}</xml>`;
    console.log(replyXml)
    res.set('Content-Type', 'application/xml');
    res.send(replyXml);
    // return replyXml;
}

function handleImageMessage(message, res) {
    // 在这里可以处理用户发送的图片消息

    // 构建回复消息的 XML
    let text = ""
    message.childrens.forEach((item, index) => {
        let type = message.types[index]
        text = text + BASE_URL + item + "." + (type == 'img' ? 'jpg' : 'mp4') + '\n'
    })
    const replyMessage = `
      <xml>
        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
        <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${text}]]></Content>
      </xml>
    `;

    // 回复用户消息
    console.log(replyMessage)
    res.set('Content-Type', 'application/xml');
    res.send(replyMessage);
}

async function sendImage(datas, res, type = "image") {
    if (type == 'image') {
        handleImageMessage(datas, res)
    } else {
        handleTextMessage(datas, res)
    }
    // let accounttoken = await getToken()
    // const url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accounttoken}`;
    // let response = await axios.post(url, datas)
    // console.log(response.data)
    // return response;
}

module.exports = {
    getToken,
    client,
    initClient,
    uploadMedia,
    sendImage,
    uploadFile
}
