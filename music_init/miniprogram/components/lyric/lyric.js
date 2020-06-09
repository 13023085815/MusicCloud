// components/lyric/lyric.js
var lyricHeight = 0;
Component({

  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: {
      type: String
    }
  },
  // 组件的生命周期
  lifetimes: {
    ready() {
      // 获取设备信息
      wx.getSystemInfo({
        success: function (res) {
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },
  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lyriclist: [
            {
              lrc,
              time: 0
            }
          ]
        })
      } else {
        this.parseLyric(lrc)

      }

    }
  },
  data: {
    lyriclist: [], // 所有的歌词集合
    nowLyricIndex: 0, // 表示当前选中的歌词
    scrollTop: 0, // 滚动条滚动的高度
  },
  methods: {
    parseLyric(sLyric) {
      var line = sLyric.split('\n'); // 用换行将歌词字符串变为数组
      var lyriclist = [] // 表示歌词列表
      // 为了获取没有时间的歌词数组
      line.forEach(item => {
        // [00:00.000]
        var regTime = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
        let time = item.match(regTime); // 匹配时间 

        if (time != null) {
          //  解决 '[00:00:01],[00:00:12]‘这个问题
          var newtime = time.join('')
          var lrc = item.split(newtime)[1] // 用时间分割 获取 歌曲

          for (var i = 0; i < time.length; i++) {

            var timeReg = time[i].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
            // 把时间转化为秒
            var time2Seconds = parseInt(timeReg[1] * 60) + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
            lyriclist.push({
              lrc,
              time: time2Seconds
            })
          }


        }
      });

      this.setData({
        lyriclist,
      })
    },
    // update 在父组件player中调用的；是实时触发的；目的为了实时返回当前播放的时间
    update(currentTime) {
      var lrclist = this.data.lyriclist;
      if (lrclist.length == 0) {
        return
      }
      for (var i = 0; i < lrclist.length; i++) {
        // 判断是否是当前播放的时间
        if (currentTime <= lrclist[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }

    }
  }
})