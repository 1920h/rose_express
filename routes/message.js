const express = require('express')
// const message = mongoose.model('message',new mongoose.Schema({}),'message')
const message = require('../modules').message

const router = express.Router()

router.post('/getMessage',async (req,res)=>{
    const body = req.body;
    const openid = body.openid;
    const page = body.page;
    const user = body.user;
    const result = await message.find({openid:openid,user:user}).sort({createAt:-1}).skip((page-1)*10).limit(10)
    res.send({msg:"ok",data:result})
})

router.post("/addMessage",async (req,res)=>{
    const body = req.body;
    await message.create(body)
    res.send({msg:"ok"})
})

module.exports = router
