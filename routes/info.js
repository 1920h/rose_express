const express = require("express")
const router = express.Router()
const mongoose = require('mongoose');
const info = mongoose.model("base_info",new mongoose.Schema({}),"base_info")
const userInfo = mongoose.model("",new mongoose.Schema({}),"user_info")

// page 页数
// type 类型
// 
router.get("/getInfo",async (req,res)=>{
    let result = await info.find();
    console.log(result)
    res.send({msg:"ok",data:result})
})

router.post('/addInfo',async (req,res)=>{
    const body = req.body;
    await info.create(body)
    res.send({msg:"ok"})
})

router.post('/getOpenId',async (req,res)=>{
    const body = req.body;
    let result = await userInfo.where({openid:body.openid});
    console.log(result)
    let infos = null;
    if(result.length!=0){
        infos = {
            openid:body.openid,
            username:body.openid,
            avatar:'HeadPortrait.jpg',
            Signature:'玫瑰永远为你绽放',
            edgeCount:0,
            fans:0,
            follows:0,
            insAccount:'',
            insPassword:''
        }
        userInfo.create(infos)
    }else{
        infos = result[0]
    }
    res.send({msg:"ok",data:infos})
})

module.exports = router;