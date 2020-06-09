const rp = require("request-promise");   // 发送请求的
const APPID = 'wxf6a3e4dfd65f066b';   // appid
const APPSECRET = 'f27efff51cc46b83ca5eb8f66cbd6903'   // 小程序的秘钥
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
const fs = require('fs');
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')

const upadateAccessToken = async () => {
    // 同发送请求；调用小程序服务，获取access_token 
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    // 获取去到access_token 后，将access_token 进行保存，保存到json文件中
    // --->写文件
    if (res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await upadateAccessToken()
    }

}

const getAccessToken = async () => {
    // 成功
    try {
        // 读文件  
        // ---> 参二：如果没值 返回的是 buffer 存的二进制数据；需要转字符串；如果有值；那么返回对应的类型utf8
        const readRes = fs.readFileSync(fileName, 'utf8');
        const readObj = JSON.parse(readRes);

        // 场景：服务宕机；宕机时间超过access_token 的过去时间
        // 解决宕机问题：用获取token时间与当前 调用方法时间比较；是否大于2小时
        const createTime = new Date(readObj.createTime).getTime();
        const nowTime = new Date().getTime();
        if (nowTime - createTime >= 7200 * 1000) {
            // 宕机时间太长；access_Token 过期 --->更新access_token-->再获取token
            await upadateAccessToken();
            await getAccessToken();
        }

        return readObj.access_token
    } catch (err) {
        // 失败
        // 如果读文件失败 那么就进行跟新 access_token 再次获取
        await upadateAccessToken();
        await getAccessToken();
    }
}

// 防止过期
// ----> 做一个定时触发器；解决过期问题
setInterval(() => {
    upadateAccessToken();
}, (7200 - 300) * 1000)  // 提前5分钟根性


module.exports = getAccessToken


// 获取token  可能遇到问题
// 1：获取失败问题：在catch 中更新
// 2：过期问题--->定时器
// 3：宕机问题--->用时间判断处理

