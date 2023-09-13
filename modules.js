const mongoose = require('mongoose');
const edge = mongoose.model("edge",new mongoose.Schema({}),"edge")
const userInfo = mongoose.model("user_info",new mongoose.Schema({
    openid:{type:String},
    username:{type:String},
    avatar:{type:String},
    Signature:{type:String},
    edgeCount:{type:String},
    fans:{type:String},
    follows:{type:String},
    insAccount:{type:String},
    insPassword:{type:String},
}),"user_info")
const message = mongoose.model("message",new mongoose.Schema({
    content:{type:String},
    createAt:{type:Number},
    messageId:{type:String},
    src:{type:String},
    type:{type:String},
    user:{type:Object},
    src:{type:String},
    state:{type:String},
    openid:{type:String},
    pichref:{type:String}
}),"message")
const userEdge = mongoose.model("user_edge",new mongoose.Schema({}),"user_edge")
const edgeLike = mongoose.model("edge_like",new mongoose.Schema({
    create_at_utc:{type:String},
    edge_id:{type:String},
    like:{type:String},
    liker:{type:String},
    update_time:{type:String},
    user:{type:String},
}),"edge_like")
const follower = mongoose.model("follower",new mongoose.Schema({}),"follower")

module.exports = {
    edge,
    userInfo,
    message,
    userEdge,
    edgeLike,
    follower
}