// miniprogram/pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    });
    // 根据歌单id 获取歌曲列表
    wx.cloud.callFunction({
      name: "music",
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then((res) => {

      var { playlist } = res.result
      this.setData({
        musiclist: playlist.tracks,
        listInfo: {
          coverImgUrl: playlist.coverImgUrl,
          name: playlist.name
        }
      })
      this.setLocalMusiclist();
      wx.hideLoading();
    })
    
  },
  // 将歌单列表保存到本地；为了播放页面 每次获取歌单信息不用频繁发送http请求
  setLocalMusiclist() {
    wx.setStorage({
      key: 'musiclist',
      data: this.data.musiclist,
    });
    
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