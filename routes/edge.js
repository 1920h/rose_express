
const express = require('express')
const mongoose = require('mongoose');
const edge = mongoose.model("edge",new mongoose.Schema({}),"edge")

const app = express.Router()

app.post('/getEdge',async (req,res)=>{
    let body = req.body;
    console.log(body);
    let page = body.page;
    let result;
    if(body.isVideo){
        result = await edge.where({media_type:2}).skip((page-1)*15).limit(15);
    }else{
        result = await edge.find().skip((page-1)*15).limit(15);
    }
    // console.log(result);
    res.send({"msg":"ok","data":result})
})

module.exports =  app;
