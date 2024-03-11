const express = require("express")
const router = express.Router()
const mongoose = require('mongoose');
const info = mongoose.model("base_info",new mongoose.Schema({}),"base_info")
// const userInfo = mongoose.model("user_info",new mongoose.Schema({}),"user_info")
const userInfo = require('../modules').userInfo
const axios = require('axios')

// https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
const APP_ID = "wx2ae8ccf82dc3ac05"
const APP_SECRET = "a4546c73f4956f229c81a7b55f18a0ea"
const LOGIN_URL = `https://api.weixin.qq.com/sns/jscode2session?appid=wx2ae8ccf82dc3ac05&secret=a4546c73f4956f229c81a7b55f18a0ea&grant_type=authorization_code&js_code=`
// page 页数
// type 类型
// 
router.get("/getInfo",async (req,res)=>{
    let result = await info.find({type:{"$in":["info","music"]}});
    res.send({msg:"ok",data:result})
})

router.post("/getStore",async (req,res)=>{
    let body = req.body;
    console.log('body',body)
    let options = {
        type:"reels"
    }
    if(body.id){
        options['id'] = body.id
    }
    let result = await info.find(options).sort({expiring_at:-1}).skip((body.page - 1) * 10).limit(10)
    res.send({"msg":"ok","data":result})
})

router.post('/addInfo',async (req,res)=>{
    const body = req.body;
    await info.create(body)
    res.send({msg:"ok"})
})

router.post("/getDetailStore",async (req,res)=>{
    const body = req.body;
    let mediaid = body.mediaid;
    const result = await info.find({"media_ids" : new RegExp(`^${mediaid}.*`, 'i')})
    res.send({msg:'ok',data:result})
})

router.post('/getOpenId',async (req,res)=>{
    const body = req.body;
    const code = body.code;
    const url = LOGIN_URL + code
    let response = await axios.get(url)
    const datas = response.data;
    let result = await userInfo.where({openid:datas.openid});
    let infos = null;
    if(result.length==0){
        infos = {
            openid:datas.openid,
            username:datas.openid,
            avatar:'HeadPortrait.jpg',
            Signature:'BLACKPINK IN YOU AREA',
            edgeCount:0,
            fans:0,
            follows:0,
            insAccount:'',
            insPassword:'',
            isVip: 0,
            isVipExpire: 0
        }
        userInfo.create(infos)
    }else{
        infos = result[0]
    }
    res.send({msg:"ok",data:infos})
})

module.exports = router;