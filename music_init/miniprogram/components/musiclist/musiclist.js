var app =  getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1,
  },
  // 组件所在页面的生命周期
  pageLifetimes: {
    // // 组件所在的页面被展示时执行	
    // show(){
    //   this.setData({
    //     playingId: app.getPlayMusicId()
    //   })
    // }
    
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e){
      var id = e.currentTarget.dataset.index
      this.setData({
        playingId:e.currentTarget.dataset.musiclistid
      })
      wx.showLoading({
        title: '加载中...',
      });
      // 跳转到播放页面
      wx.navigateTo({
        url: `/pages/player/player?musicId=${id}`,
        success: (result)=>{
          wx.hideLoading();
        },
        fail: ()=>{
          wx.hideLoading();
        },
      });
    }
  }
})
