// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter= require('tcb-router')  // 云函数路由
const rp = require("request-promise")

const BASE_URL = 'http://musicapi.xiecheng.live'
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const app = new TcbRouter({
    event,  // 自动的去找 请求的是哪个路由
  });

  // 获取歌单列表
  app.router('playlist',async (ctx,next)=>{
    ctx.body = await db.collection('playlist')
    .skip(event.start)    // 从集合中第几个索引值开始
    .limit(event.count)   // 查询多少条数据
    .orderBy('createTime','desc')  // 排序处理  
    .get()
    .then((res)=>{
      console.log(res)
      return res
    })
  })
  
  // 根据歌单id 获取歌曲列表
  app.router('musiclist',async(ctx,next)=>{
   ctx.body = await rp(BASE_URL + `/playlist/detail?id=${event.playlistId}`)
    .then((res)=>{
      return JSON.parse(res)
    })
  })

  // 根据音乐id 获取音乐播放地址
  app.router('musicUrl',async(ctx,next)=>{
  
     ctx.body = await rp(BASE_URL+`/song/url?id=${event.musicId}`)
     .then((res)=>{
      //  这里需要做一个延迟请求处理
      return res
     })
  })

  // 根据音乐ID 获取音乐歌词
  app.router('lyric',async (ctx,netx)=>{
    ctx.body = await rp(BASE_URL +`/lyric?id=${event.musicId}`).then((res)=>{
      return res
    })
  })
  return app.serve()
}