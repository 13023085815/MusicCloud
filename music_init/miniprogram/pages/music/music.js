
const MAX_LIMIT = 12;
const db = wx.cloud.database()
Page({
  data: {
    swiperImgs: [],
    playlist:[],

  },
  onLoad: function(options) {
    this.getPlaylist();
    this.getSwiperList();
  },

  getPlaylist(){
    wx.showLoading({
      title: '加载中...',
    });

    wx.cloud.callFunction({
      name:"music",
      data:{
        start:this.data.playlist.length,
        count:MAX_LIMIT,
        $url:'playlist'
      }
    }).then((res)=>{
      this.setData({
        playlist:this.data.playlist.concat(res.result.data)
      })
      wx.hideLoading();
    })
  },
  getSwiperList(){
    db.collection("swiper").get().then((res)=>{
      console.log(res)
      this.setData({
        swiperImgs:res.data,
      })
    })
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 清空歌单列表  在获取歌单列表
    this.setData({
      playlist:[]
    })
    this.getPlaylist();
    this.getSwiperList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getPlaylist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})