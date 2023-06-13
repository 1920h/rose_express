
const express = require('express')
const mongoose = require('mongoose');
const comments = mongoose.model("ins_comment",new mongoose.Schema({}),"ins_comment")

const router = express.Router()

router.post("/getComments",async (req,res)=>{
    const body = req.body;
    let result = await comments.where({mediaId:body.edgeid}).skip((page-1)*10).limit(10)
    res.send({msg:"ok",data:result})
})

export default router;