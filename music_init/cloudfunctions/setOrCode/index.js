// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: wxContext.OPENID,
      // page:'pages/min/min'  // --> 页面地址错误
      lineColor:{
        "r":312,
        "g":12,
        "b":57
      },
      is_hyaline:true,
    })
    console.log(result)
    
    // 怎么让二进制 buffer 形成一个图片 
    // --->通过将二进制图片存到云存储中；返回 图片的fileID
    const code = await cloud.uploadFile({
      cloudPath:"orCode/"+Date.now()+"-"+Math.random()+".jpg",
      fileContent:result.buffer
    })
    return code.fileID

  } catch (err) {
    console.log(err)
    return err
  }
}