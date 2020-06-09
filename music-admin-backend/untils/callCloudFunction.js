const getAccessToken = require('../untils/getAccessToken.js')
const rp = require("request-promise")

/**
 * 触发云函数方法封装
 * @param {*} ctx     服务的上下文对象
 * @param {*} fnName  云函数名字
 * @param {*} params  云函数需要的请求参数
 */
const callCloudFunction = async(ctx,fnName,params)=>{

    const ACCESS_TOKEN = await getAccessToken()        // 访问接口令牌
    // const ENV = 'tast-4il1z'                        // 云环境id  将云id 放在全局路由
    const URL =`https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.ENV}&name=${fnName}`
   
    const options = { 
        url:URL,
        method:'POST',
        body:{  
            ...params
        },
        json:true // 配置返回数据为json格式
    }
    return await rp(options).then((res)=>{
        return res
    }).catch((err)=>{
        return {
            msg:'触发云函数出错了',
            err,
        }
    })
}

module.exports = callCloudFunction