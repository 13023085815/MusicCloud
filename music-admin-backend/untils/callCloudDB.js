/**
 * httpAPI 操作云数据的方法封装
 */
const getAccessToken = require("../untils/getAccessToken.js");
const rp = require('request-promise');

/**
 * 
 * @param {*} ctx     上下文对象
 * @param {*} fnName  增删改查 数据库方法  databasequery databasedelete ... 官网说明有
 * @param {*} query   调用云数据库的请求参数
 */
const callCloudDB = async (ctx,fnName,query={})=>{
    const ACCESS_TOKEN = await getAccessToken();
    let options = {
        method:"POST",
        url:` https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
        body: {
            "env":ctx.state.ENV,
            "query":query
        },
        json:true
    }
    return await rp(options).then((res)=>{
        return res
    }).catch((err)=>{
        console.log(err)
        return err
    })
}

module.exports = callCloudDB
