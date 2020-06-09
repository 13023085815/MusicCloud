// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:0
  },
  // 监听组件数据的变化
  observers: {
    // 监听playlist 对象 playCount 值的变化
    ['playlist.playCount'](val){
     var count =  this.tranNumber(val,2)
     this.setData({
       count,
     })
    // 坑： 死循环
    //  this.setData({
    //    ['playlist.playCount']:count,
    //  })
    }
  },
  methods: {
    // 播放量 数据量处理  
    tranNumber(num,poiot){
      let numStr = num.toString().split('.')[0];
      if(numStr.length<6){
        return numStr
      }else if(numStr.length>=6 && numStr.length<=8){
        let decimal = numStr.substring(numStr.length-4,numStr.length-4+poiot)
        return parseFloat(parseInt(num/10000) + '.' + decimal) +'万'
      }else if(numStr.length>8){
        let decimal = numStr.substring(numStr.length-8,numStr.length-8+poiot)
        return parseFloat(parseInt(num/100000000) + '.' + decimal) +'亿'
      }
    },
    goToMusiclist(){
      wx.showLoading({
        title: '加载中',
      });
      // 点击歌单 跳转到歌曲列表
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
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
