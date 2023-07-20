const express = require('express');
const mongoose = require('mongoose');
const subModel = mongoose.model('subscribe', new mongoose.Schema({ openid: String, count: Number }), 'subscribe')
const edge = require("../modules").edge
const app = express.Router();
const parseString = require('xml2js').parseString;
const getToken = require("../utils").getToken
const client = require("../utils").initClient
const uploadMedia = require("../utils").uploadMedia
const sendImage = require("../utils").sendImage


app.post("/sub", async (req, res) => {
    const body = req.body;
    let result = await subModel.findOne({ openid: body.openid })
    console.log('result', result)
    if (result == null) {
        await subModel.create({ openid: body.openid, count: 1 })
    } else {
        await subModel.findOneAndUpdate({ 'openid': body['openid'] }, { '$inc': { 'count': 1 } })
        // result.count = result.count + 1
        // await subModel.updateOne({openid:body['openid']},{count:result.count + 1})
    }

    res.send({ 'msg': 'ok' })
})

app.get('/sub/:openid', async (req, res) => {
    console.log(req.params)
    let result = await subModel.findOne({ openid: req.params.openid })
    let count = null;
    if (!result) {
        count = 0
    } else {
        count = result.count
    }
    res.send({ 'msg': 'ok', 'data': count })
})

app.get('/wx', (req, res) => {
    const body = req.query;
    console.log(body)
    res.send(body.echostr)
})

app.post('/wx', async (req, res) => {
    let token = await getToken()
    console.log("aaaa", token)
    // await uploadMedia("/home/rose_express/images/edge/0byzXDAG1v.jpg")
    let buffer = [];
    req.on('data', function (data) {
        buffer.push(data);
    });
    req.on('end', () => {
        let msgXml = Buffer.concat(buffer).toString('utf-8');
        console.log("msgXml", msgXml)
        parseString(msgXml, async (err, result) => {
            console.log(result)
            if (result.xml.MsgType[0] == "text") {
                let media = result.xml.Content[0]
                let FromUserName = result.xml.FromUserName[0]
                let ToUserName = result.xml.ToUserName[0]
                console.log(String.prototype.toLowerCase.call(result.xml.Content[0]),String.prototype.toLowerCase.call(result.xml.Content[0])=='ins')
                if (String.prototype.toLowerCase.call(result.xml.Content[0]) == 'ins') {
                    sendImage({
                        FromUserName: FromUserName,
                        ToUserName: ToUserName,
                    }, res, "text")
                } else {
                    let results = await edge.findOne({ edge_id: media })
                    if(results == null){
                        res.send("")
                    }else{
                    results = JSON.parse(JSON.stringify(results))
                    console.log(results)
                    if(results == null){
                        res.send("")
                    }
                    let children = results.edge_sidecar_to_children.split(';');
                    if(children.length > 0){
                        children.pop()
                    }
                    console.log('results.edge_sidecar_to_children_type',results.edge_sidecar_to_children_type,typeof results.edge_sidecar_to_children_type)
                    let types = results.edge_sidecar_to_children_type == "" ?[] : typeof results.edge_sidecar_to_children_type == "string" ? JSON.parse(results.edge_sidecar_to_children_type) : results.edge_sidecar_to_children_type
                    types.unshift(results.media_type == 2 ? "video" : "img")
                    console.log(types)
                    children.unshift(results.shortcode)
                    let rds = await client()
                    let isExists = await rds.EXISTS(children[0])
                    console.log('isExists', isExists)
                    sendImage({
                        FromUserName: FromUserName,
                        ToUserName: ToUserName,
                        msgtype: 'image',
                        childrens:children,
                        types:types
                    }, res)
                    if (!isExists) {
                        // children.forEach(item => {
                        //     if (item != "") {
                        //         uploadMedia(item).then(ress => {
                        //             console.log('res', ress)
                        //             sendImage({
                        //                 FromUserName:FromUserName,
                        //                 ToUserName: ToUserName,
                        //                 msgtype: 'image',
                        //                 mediaid: ress
                        //             },res)
                        //         })
                        //     }
                        // })
                        // let ress = await uploadMedia(children[0])
                        // sendImage({
                        //     FromUserName: FromUserName,
                        //     ToUserName: ToUserName,
                        //     msgtype: 'image',
                        //     mediaid: ress
                        // }, res)
                    } else {
                        // children.forEach(item => {
                        //     rds.get(item).then(ress => {
                        //         if (ress != null) {
                        //             sendImage({
                        //                 FromUserName:FromUserName,
                        //                 ToUserName: ToUserName,
                        //                 msgtype: 'image',
                        //                 mediaid: ress
                        //             },res)
                        //         }
                        //     })
                        // })
                        // let ress = await rds.get(children[0])
                        // sendImage({
                        //     FromUserName: FromUserName,
                        //     ToUserName: ToUserName,
                        //     msgtype: 'image',
                        //     mediaid: ress
                        // }, res)
                    }
                }
                }
            }
        })
    })
})

module.exports = app;