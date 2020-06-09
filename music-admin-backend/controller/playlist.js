// 这里的路由写的是与歌单管理有关的控
const Router = require('koa-router')
const router = new Router()
const callCloudFunction = require("../untils/callCloudFunction.js")    // 封装的触发云函数的方法
const callCloudDB = require("../untils/callCloudDB.js")

// 获取歌单列表
router.get('/list', async (ctx, next) => {
    // 触发云函数 通过云函数获取歌单列表   发送Post请求
    const query = ctx.request.query;  // 获取请求参数
    const options = {
        $url: "playlist",
        start: parseInt(query.start),
        count: parseInt(query.count)
    }
    let playlist = []

    const res = await callCloudFunction(ctx, 'music', options)
    if(res.resp_data){
        playlist = JSON.parse(res.resp_data).data
    }

    ctx.body = {
        data: playlist,
        code: 20000
    }
})

// 通过歌单ID 获取歌单对象  
router.get('/getById',async(ctx,next)=>{
    //bug
    const query = `db.collection('playlist').where({_id:"${ctx.request.query.id}"}).get()`
    let res = await callCloudDB(ctx,'databasequery',query)
    let music= {}
    if(res.data){
       music = JSON.parse(res.data)
    }
    ctx.body = {
        data:music,
        code:20000,
    }
})

// 更新歌单数据   
router.post('/updatePlaylist',async(ctx,next)=>{
    const params = ctx.request.body;   // 获取请求体中内容
    const query = `db.collection('playlist').where({_id:'${params._id}'})
    .update({
        data:{
            name:'${params.name}',
            copywriter:'${params.copywriter}'
        }
    })`;
   let res = await callCloudDB(ctx,'databaseupdate',query)
   ctx.body = {
       code:20000,
       data:res
   }
})

// 删除歌单数据
router.get('/del',async(ctx,next)=>{
    const params = ctx.request.query
    const query = `db.collection('playlist').where({_id:'${params.id}'}).remove()`;
    let res = await callCloudDB(ctx,'databasedelete',query)
    ctx.body = {
        code:20000,
        data:res
    }
})
module.exports = router