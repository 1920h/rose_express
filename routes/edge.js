
const express = require('express')
const mongoose = require('mongoose');
const edge = mongoose.model("edge",new mongoose.Schema({}),"edge")

const app = express.Router()

app.post('/getEdge',async (req,res)=>{
    let body = req.body;
    console.log(body);
    let page = body.page;
    let result = await edge.find().skip(page*15).limit(15);
    console.log(result);
    res.send({"msg":"ok","data":[]})
})

module.exports =  app;