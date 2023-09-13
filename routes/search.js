const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const uploadImage = require('../utils').uploadFile
const userinfo = require('../modules').userInfo
const edgeLike = require('../modules').edgeLike
const follower = require('../modules').follower

const router = express.Router()

router.post('/searchFriend', (req, res) => {
    const body = req.body;
    const name = body.name;
    const page = body.page;
    // /.*肉肉.*/
    const result = userinfo.find({ username: new RegExp(`.*${name}.*`, 'i') }).skip((page - 1) * 10).limit(10)
    res.send({ msg: "ok", data: result })
})

router.post('/getFollower', async (req, res) => {
    const body = req.body;
    const username = body.username;
    const page = body.page;
    const isFan = body.isFan;
    let options = {}
    if (isFan) {
        options['user'] = username
    } else {
        options['follower'] = username
    }
    const result = await follower.find(options).skip((page - 1) * 15).limit(15)
    res.send({ msg: "ok", data: result })
})

router.post('/addFollower', async (req, res) => {
    const body = req.body;
    await follower.create(body)
    res.send({msg:"ok"})
})

router.post('/updateUserInfo', async (req, res) => {
    const body = req.body;
    const openid = body.openid;
    // await userinfo.create(userInfo)
    await userinfo.findOneAndUpdate({ openid: openid }, { "$set": userInfo })
    res.send({ msg: "ok" })
})

router.post('/updateEdgeLike', async (req, res) => {
    const body = req.body;
    const result = await edgeLike.findOneAndUpdate({ edge_id: body.edge_id, liker: body.liker }, { "$set": body })
    console.log(result)
    if(result == null){
        await edgeLike.create(body)
    }
    res.send({msg:"ok",data:[]})
})

router.post('/getEdgeLike', (req, res) => {
    const body = req.body;

})

router.post('/uploadImage', upload.single('avatar'), (req, res) => {
    console.log("upload")
    const files = req.file;
    console.log('files', files, '5')
    uploadImage(files.path, files.originalname)
    res.send({ msg: "ok" })
})

router.post('/uploadBase64', (req, res) => {

})

module.exports = router
