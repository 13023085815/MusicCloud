//app.js
App({
  onLaunch: function (options) {
    console.log(options)
    // 在小程序启动时候 检测版本更新
    this.checkUpdate()
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.getOpenid();
    //globalData 此处存放全局数据
    this.globalData = {
      playingMusicId:-1 , // 表示当前播放的音乐
      openid:-1,
    }
  
  },
  onShow(options){
    console.log(options)
  },

  setPlayingMusicId(id){
      this.globalData.playingMusicId = id
  },
  getPlayMusicId(){
    return this.globalData.playingMusicId
  },
  // 获取oppenId
  getOpenid(){
    wx.cloud.callFunction({
      name:"login",
    }).then((res)=>{
      let openid = res.result.openid
      this.globalData.openid= openid
      // 将openid 现价到storage上
      if(wx.getStorageSync(openid)==''){
        wx.setStorageSync(openid, []);

      }
    })
  },


  checkUpdate(){
    // 获取版本更新管理
    var updateManager = wx.getUpdateManager();
    // 版本更新 加载时，执行onUpdateReady
    updateManager.onUpdateReady(()=>{
      wx.showModal({
        title: '提示',
        content: '有新版本了请重新启动',
        success:(res)=>{
          // 点击确定
          if(res.confim){
            // 重启小程序
            updateManager.applyUpdate();
          }
        }
      })
    })
  }
})
