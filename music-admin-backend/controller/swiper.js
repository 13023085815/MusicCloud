const Router = require('koa-router')
const router = new Router()
const callCloudDB = require("../untils/callCloudDB.js")
const callCloudStorage = require("../untils/callCloudStorage")

// 获取轮播图列表
router.get('/list', async (ctx, next) => {
    // httpApi 操作数据库；每次最多可以获取10条
    const query = `db.collection('swiper').get()`;
    const res = await callCloudDB(ctx, 'databasequery', query);
    // console.log(res)
    // 不能直接向响应 云存储地址；因为在网页端 不识别

    // httpAPI 操作云存储  获取 页面可以识别的 地址  ----> 获取文件下载地址
    let fileList = [];
    const data = res.data;
    data.forEach(fileItem => {
        fileList.push({
            fileid: JSON.parse(fileItem).fileid,
            max_age: 7200
        })
    });
    let downloadRes = await callCloudStorage.download(ctx, fileList)

    // 重组响应数据的数据结构
    let resultData = [];
    downloadRes.file_list.forEach((item, i) => {
        resultData.push({
            download_url: item.download_url,
            fileid: item.fileid,
            _id: JSON.parse(data[i])._id
        })
    })
    ctx.body = {
        code: 20000,
        data: resultData
    }

})

// 上传图片
router.post('/upload', async (ctx, next) => {
    // 1 将图片上传到云存储中
    let fileid = await callCloudStorage.upload(ctx);
    // 2：将云存储中地址存到云数据库中
    const query = `
    db.collection('swiper').add({
        data:{
            fileid:'${fileid}'
        }
    })
    `
    const res = await callCloudDB(ctx, 'databaseadd', query);
    ctx.body = {
        code: 20000,
        id_list: res.id_list
    }
})

router.get("/del", async (ctx, next) => {
    const params = ctx.request.query
    // 删除云数据中的内容
    const query = `db.collection("swiper").where({_id:'${params._id}'}).remove()`
    let delDBRes = await callCloudDB(ctx, 'databasedelete', query)

    // 删除云存储中文件
    let delStorageRes = await callCloudStorage.delete(ctx, [params.fileid]);
    
    ctx.body = {
        code: 20000,
        data: {
            delDBRes,
            delStorageRes
        }
    }

})
module.exports = router