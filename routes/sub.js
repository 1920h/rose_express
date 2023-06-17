const express = require('express');
const mongoose = require('mongoose');
const subModel = mongoose.model('subscribe', new mongoose.Schema({ openid: String,count:Number }),'subscribe')
const app = express.Router();

app.post("/sub",async (req,res)=>{
    const body = req.body;
    let result = await subModel.findOne({openid:body.openid})
    console.log('result',result)
    if(result == null){
        await subModel.create({openid:body.openid,count:1})
    }else{
        await subModel.findOneAndUpdate({'openid':body['openid']},{'$inc': {'count': 1}})
        // result.count = result.count + 1
        // await subModel.updateOne({openid:body['openid']},{count:result.count + 1})
    }

    res.send({'msg':'ok'})
})

app.get('/sub/:openid',async (req,res)=>{
    console.log(req.params)
    let result = await subModel.findOne({openid:req.params.openid})
    let count = null;
    if(!result){
        count = 0
    }else{
        count = result.count
    }
    res.send({'msg':'ok','data':count})
})

app.get('/wx',(req,res)=>{
    const body = req.query;
    console.log(body)
    res.send(body.echostr)
})

module.exports = app;