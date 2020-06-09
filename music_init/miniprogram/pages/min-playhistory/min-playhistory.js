let app = getApp();
Page({
  data: {
    musiclist:[]
  },

  onLoad: function (options) {
    let openid = app.globalData.openid
    let playHistory = wx.getStorageSync(openid)
    // 解决；切换音乐 时 不是 播放历史歌单中的列表信息
    wx.setStorage({
      key: 'musiclist',
      data: playHistory,
    });
    // 在最近播放页面播放音乐；切换上一首下一首应该是最近播放列表中音乐
    this.setData({
      musiclist:playHistory
    })

    if(this.data.musiclist.length==0){
      wx.showModal({
        title: '最近播放记录为空',
        content: '',
      });
    }
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