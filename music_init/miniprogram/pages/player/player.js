var musiclist = []; // 歌曲列表
var newPlayingIndex = -1  // 表示当前播放的歌曲索引值
// 获取全局唯一的背景音频管理器
var backAudioManager = wx.getBackgroundAudioManager();
const app = getApp()

Page({
  data: {
    picUrl: "",   // 播放页面的背景图片
    isPlaying: true,  // 是否播放
    isLyricShow: false, // 表示歌词的显示隐藏
    lyric: '',// 歌词数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    newPlayingIndex = options.musicId;
    this.getLocalMusic(newPlayingIndex)
  },

  // 从本地获取歌曲列表
  getLocalMusic(index) {
    musiclist = wx.getStorageSync('musiclist');
    this.getMusicDetail()
    wx.hideLoading();
  },

  // 获取歌曲详情信息  (根据newPlayingIndex获取歌曲详情)
  getMusicDetail() {
    var music = musiclist[newPlayingIndex];

    wx.setNavigationBarTitle({
      title: music.name,
    });
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    })
    var musicId = music.al.id; // 获取的是音乐的ID

    app.setPlayingMusicId(musicId)

    wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "musicUrl",
        musicId,
      }
    }).then(((res) => {

      var result = JSON.parse(res.result)
      // 背景音乐的配置信息
      if (result.data[0].url) {

        backAudioManager.title = music.name  //音频标题，
        backAudioManager.singer = music.ar[0].name  //歌手名
        backAudioManager.coverImgUrl = music.al.picUrl  //封面图 URL，
        backAudioManager.src = result.data[0].url // 音频地址
        backAudioManager.epname = music.al.name //专辑名
        // 保存播放历史
        this.savaPlayHistory()

        // 背景音乐添加后 表示播放
        this.setData({
          isPlaying: true
        })


        // 有音乐的前提下才有歌词

        // 加载歌词
        wx.cloud.callFunction({
          name: "music",
          data: {
            musicId,
            $url: "lyric"
          }
        }).then((res) => {
          var lyric = '暂无歌词'
          var lrc = JSON.parse(res.result).lrc
          if (lrc) {
            lyric = lrc.lyric
          }
          this.setData({
            lyric,
          })


        }).catch((Err) => {
          wx.showToast({
            title: '歌词出错了' + Err
          })
        })



      } else { // 没有音乐地址

        // 没有音乐地址停止播放当前的北京音乐
        backAudioManager.stop()
        wx.showToast({
          title: '音乐需要开通vip,返回上一页',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: (result) => {
          }
        });
      }


      // /song/detail?ids=347230
    })).catch((err) => {
    })
  },

  // 点击播放 暂停
  togglePlaying() {
    // 正在播放
    if (this.data.isPlaying) {
      backAudioManager.pause(); // 暂停
    } else {
      backAudioManager.play() // 播放
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  // 上一首 
  onPrev() {
    newPlayingIndex--
    if (newPlayingIndex < 0) {
      newPlayingIndex = musiclist.length - 1
    }
    this.getMusicDetail()
  },
  // 下一首
  onNext() {
    newPlayingIndex++
    if (newPlayingIndex == musiclist.length) {
      newPlayingIndex = 0
    }
    this.getMusicDetail()
  },
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })

    // 加载歌词
    // var music = musiclist[newPlayingIndex];
    // var musicId = music.al.id
    // wx.cloud.callFunction({
    //   name: "music",
    //   data: {
    //     musicId,
    //     $url: "lyric"
    //   }
    // }).then((res) => {
    //   var lyric = '暂无歌词'
    //   var lrc = JSON.parse(res.result).lrc
    //   if (lrc) {
    //     lyric = lrc.lyric
    //   }
    //   this.setData({
    //     lyric,
    //   })
    // }).catch((Err) => {
    //   wx.showToast({
    //     title: '歌词出错了' + Err
    //   })
    // })

  },
  timeUpdate(event) {
    // this.selectComponent 方法获取子组件实例对象\,可以直接访问组件的任意数据和方法。

    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  musicPlay() {
    this.setData({
      isPlaying: true
    })
  },
  musicPause() {
    this.setData({
      isPlaying: false
    })
  },

  // 定义保存当前播放音乐
  savaPlayHistory() {
    let music = musiclist[newPlayingIndex];// 获取去当前播放的歌曲信息
    let openid = app.globalData.openid;
    let history = wx.getStorageSync(openid);
    let flag = false; // 当前播放的音乐是否存在历史播放记录中 true 存在 false 不存在
    for (var i = 0, len = history.length; i < len; i++) {
      if (history[i].id == music.id) {
        flag = true
        break
      }
    }
    if (!flag) {
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history,
      });
    }
  }

})