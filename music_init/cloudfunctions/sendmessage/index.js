// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext()
    // 使用云调用：调用小程序服务中 订阅消息的推送方法  subscribeMessage
    const result = cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: '/pages/blog-comment/blog-comment?blogId=' + event.blogId,
      lang: 'zh_CN',
      data: {
        // key 按照后台管理提示 固定写法
        thing1: {
          value: event.nickName
        },
        thing2: {
          value: event.content
        }
      },
      templateId: 'W7C5mZkD-j_IZ9wLlWUZJ9XSNinIi_QvPo6VdMssL4I', // 模板id   ---->  43013 错误（因为没授权）
      miniprogramState: 'developer',  // 配置打开方式是开发版，正式版还是体验版，默认正式版本
      // formId: event.formId  // 模板消息推送；马上下架了
    });
    
    return result

  } catch (err){
    console.log(err)
    return err
  }
}