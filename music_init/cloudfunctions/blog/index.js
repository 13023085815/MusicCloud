// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require("tcb-router")
cloud.init()

let db = cloud.database();
const MAX_lIMIT = 100;
let blogCollection = db.collection('blog')
// 云函数入口函数
exports.main = async(event, context) => {
  const app = new tcbRouter({
    event
  });
  
  // 获取博客列表的接口
  app.router('list', async(ctx, next) => {
    const {
      keyword,
      start,
      count
    } = event
    let w = {}
    if (keyword.trim() != '') {
      // 将查询条件放在对象中 
      w = {
        // 根据用户数据的内容查询 , 以 正则匹配的 keyword 结果为 查询条件
        content: db.RegExp({
          regexp: keyword,
          opions: 'i'
        })
      }

    }
    // 分页查询，从第一个索引值开始 查询多少条数据
    let bloglist = await blogCollection
      .where(w)     // 条件查询  根据某个字段查询，参数是一个对象；对象为查询条件
      .skip(start)   // 从集合中第几个索引值开始查新
      .limit(count)  // 查询多少条数据
      .orderBy('createTime', 'desc')  // 根据那个字段开始排序
      .get()         // 获取数据 返回promise对象
      .then((res) => {  // 查询成功后  res 接收查询结果
        return res.data
      })
    ctx.body = bloglist
  })

  // 获取博客详情
  app.router('detail', async(ctx, next) => {
    let blogId = event.blogId;
    // 博客详情数据
    let detail = await db.collection("blog").where({
      _id: blogId
    }).get().then((res) => {
      return res.data
    })
    // 查询评论信息 
    let countResult = await db.collection('blog-comment').count();
    let total = countResult.total;
    let commentList = {
      data: []
    }
    if (total > 0) {
      let tasks = []
      const batchTimes = Math.ceil(total / MAX_lIMIT);
      for (var i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment').skip(i * MAX_lIMIT)
          .limit(MAX_lIMIT).where({
            blogId,
          }).orderBy('createTime', "desc").get()
        tasks.push(promise);
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      detail,
      commentList
    }
  })

  const wxContext = cloud.getWXContext();
  // 通过openid 获取博客列表
  app.router("getBloglistByOpenid", async(ctx, next) => {
    ctx.body = await blogCollection.where({
        _openid: wxContext.OPENID
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res.data
      })
  })

  return app.serve()
}