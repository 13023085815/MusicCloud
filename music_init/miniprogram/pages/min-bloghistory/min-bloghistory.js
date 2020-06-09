
let MAX_LIMIT = 10
Page({
  data: {
    blogList: []
  },


  onLoad: function (options) {
    this.getBloglistByOpenid()
  },

  // 通过openid 获取当前用户发布的博客列表
  getBloglistByOpenid() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: "getBloglistByOpenid",
        start: this.data.blogList.length,
        count: MAX_LIMIT,
      }
    }).then(res => {
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      wx.hideLoading();
    })
  },

  // 跳转到评论正文
  goComment(event) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
      success: () => {
        wx.hideLoading();
      },
      fail:()=>{
        wx.hideLoading();
      }
    });

  },


  onPullDownRefresh: function () {
    this.setData({
      blogList:[]
    })
    this.getBloglistByOpenid()
  },


  onReachBottom: function () {
    this.getBloglistByOpenid()
  },

  onShareAppMessage: function (event) {
    let blog = event.target.dataset.blog
    return {
      title:blog.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blog._id}`,
    }
  }
})