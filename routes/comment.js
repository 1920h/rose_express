
const express = require('express')
const mongoose = require('mongoose');
const ins_comments = mongoose.model("ins_comment",new mongoose.Schema({}),"ins_comment")
const comment = mongoose.model("comment",new mongoose.Schema({
    mediaId:{type:String},
    user_id:{type:String},
    text:{type:String},
    type:{type:String},
    created_at_utc:{type:Number},
    comment_like_count:{type:Number},
    comment_replay_count:{type:Number},
    username:{type:String},
    state:{type:String},
    text:{type:String},
    origin:{type:String},
    user:{type:Object},
    isUser:{type:Boolean},
    isWx:{type:Boolean},
}),"comment")
const router = express.Router()

router.post("/getComments",async (req,res)=>{
    const body = req.body;
    let result2 = [];
    // console.log(typeof body.edgeid,body.edgeid)
    // console.log(await comment.find({mediaId:String(body.edgeid)}))
    let result1 = await comment.find({mediaId:body.edgeid}).skip((body.page-1)*10).limit(10)
    console.log(result1.length)
    if(result1.length < 10){
        result2 = await ins_comments.where({mediaId:body.edgeid}).skip((body.page-1)*10).limit(10)
        console.log(result2.length)
        result1.push(...result2)
    }
    console.log(result1.length)
    res.send({msg:"ok",data:result1})
})


router.post("/sendComment",async (req,res)=>{
    const body = req.body;
    console.log(body)
    if(body.username){
        await comment.create(body)
    }
    res.send({msg:"ok"})
})

module.exports = router;