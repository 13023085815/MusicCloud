// miniprogram/pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime.js'
Page({

  data: {
    blog:{},
    commentList:[],
    blogId:''
  },

  onLoad: function (options) {
    this.setData({
      blogId:options.blogId
    })
    this.getBlogDetail()
  },

  // 获取博客详情；评论信息
  getBlogDetail(){
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId:this.data.blogId,
        $url:'detail'
      }
    }).then((res)=>{
      let commentList  = res.result.commentList.data;
      commentList.forEach(element => {
        // 时间格式化
       element.createTime = formatTime(new Date(element.createTime))
      });
      this.setData({
        blog:res.result.detail[0],
        commentList:res.result.commentList.data
      })
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})