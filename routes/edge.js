
const express = require('express');
const router = require('./info');
const { edgeLike } = require('../modules');
// const mongoose = require('mongoose');
// const edge = mongoose.model("edge",new mongoose.Schema({}),"edge")
const edge = require("../modules").edge
const userEdge = require("../modules").userEdge

const app = express.Router()

app.post('/getEdge',async (req,res)=>{
    let body = req.body;
    let page = body.page;
    let result;
    let option = {}
    if(body.user){
        option['user'] = body.user
    }
    if(body.isVideo){
        option['media_type'] = 2;
        page = page + 1
    }
    if(body.isVideo){
        result = await edge.where(option).sort({taken_at_timestamp:-1}).skip((page-1)*15).limit(15);
    }else{
        result = await edge.find(option).sort({taken_at_timestamp:-1}).skip((page-1)*15).limit(15);
    }
    // console.log(result);
    res.send({"msg":"ok","data":result})
})

router.post('/getEdgeDetail',async (req,res)=>{
    const body = req.body;
    const edge_id = body.edge_id;
    const liker = body.liker;
    const result1 = await edge.find({edge_id:edge_id});
    const result2 = await edgeLike.find({liker:liker,edge_id:edge_id})
    res.send({msg:"ok",data:[result1,result2]})
})

router.post('/getEdgeLike',async (req,res)=>{
    const body = req.body;
    const edge_id = body.edge_id;
    const liker = body.liker;
    const result2 = await edgeLike.find({liker:liker,edge_id:edge_id})
    res.send({msg:"ok",data:result2})
})

router.post('/addUserEdge',async (req,res)=>{
    const body = req.body;
    await userEdge.create(body)
    res.send({msg:"ok"})
})

router.post("/getUserEdge",async (req,res)=>{
    const body = req.body;
    const page = body.page;
    const openid = body.openid;
    const result = await userEdge.find({shortcode:openid}).sort({taken_at_timestamp:-1}).skip(((page-1)*9)).limit(9)
    res.send({msg:'ok',data:result})
})

router.post('/getUserEdgeDetail',async (req,res)=>{
    const body = req.body;
    const edge_id = body.edge_id;
    const liker = body.liker;
    const result1 = await userEdge.find({edge_id:edge_id});
    const result2 = await edgeLike.find({liker:liker,edge_id:edge_id})
    res.send({msg:"ok",data:[result1,result2]})
})

module.exports =  app;
