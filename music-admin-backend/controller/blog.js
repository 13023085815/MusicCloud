// 这里的路由写的是与歌单管理有关的控
const Router = require('koa-router')
const router = new Router()
const callCloudDB = require("../untils/callCloudDB.js")
const callCloudStorage = require("../untils/callCloudStorage.js")

// 分页获取博客列表
router.get('/list',async(ctx,next)=>{
    const params = ctx.request.query;
    const query =`
    db.collection('blog').skip(${params.start}).limit(${params.count}).orderBy('createTime','desc').get()
    `
    // const queryCount = `db.collection('blog').count()`
    const res = await callCloudDB(ctx,'databasequery',query);
    // const countRes = await callCloudDB(ctx,'databasecount',queryCount);
    if(res.data){
        ctx.body = {
            code:20000,
            data:res.data,
            // total:countRes.count
        }
    }else{
        ctx.body={
            errmsg:res.errmag
        }
    }
})

router.post("/del",async(ctx,next)=>{
    const params = ctx.request.body;
    // 删除blog
    const queryBlog = `db.collection('blog').where({_id:"${params._id}"}).remove()`;
    const delBlogRes = await callCloudDB(ctx,'databasedelete',queryBlog)

    // 删除blog-comment
    const queryComment = `db.collection('blog-comment').where({blogId:'${params._id}'}).remove()`
    const delCommentRes = await callCloudDB(ctx,'databasedelete',queryComment);

    // 删除图片
    const delStorageRes = await callCloudStorage.delete(ctx,params.img);
    ctx.body={
        code:20000,
        data:{
            delBlogRes,
            delCommentRes,
            delStorageRes
        }
    }

})
module.exports = router