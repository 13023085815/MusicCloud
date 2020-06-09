var movableAreaWidth = 0; // 可移动区域总宽度
var movableViewWidth = 0; // 已经移动的宽度
var currentSec = -1 //  当前秒数
var duration = 0; // 歌曲的总时间，以秒为单位
var isMoving = false // 表示当前是否拖拽，解决：当进度条拖拽时候和timeUptate事件冲突的问题

var backAudioManager = wx.getBackgroundAudioManager();
Component({

  properties: {

  },
  data: {
    showTime: {
      currentTime: "00:00", // 播放时间
      totalTime: "00:00",   // 歌曲总时间
    },
    movableDis: 0,  // 小圆圈拖动的距离 (可以通过change 事件实时获取的距离) --- 位移
    progress: 0,  // 进度条被选中的百分比 进度条移动的距离
  },

  // 组件的生命周期
  lifetimes: {
    ready() {
      this.getMobleDis();
      this.bindBGMEvent();
    }
  },
  methods: {
    // 当moble-view 移动的时候；
    onChange(event) {
      if (event.detail.source == 'touch') {
        // 圆圈移动的值 /  移动总长 * 100 = 进度条的进度
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100; // 根据唯一计算process
        this.data.movableDis = event.detail.x // 记录移动位置
        isMoving = true;
      }
    },
    onTouchEnd() {
      var currentTimeFmt = this.dateFormat(Math.floor(backAudioManager.currentTime))
      // 当移动进度条松开手指的时候 更新
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
      // 当前播放音乐进度 = 总时间 * 进度的百分比 = 总时间 * 进度大小/100
      backAudioManager.seek(duration * this.data.progress / 100); // 将音乐快进到 某个位置

      isMoving = false
    },
    getMobleDis() {
      // 小程序原生获取组件信息  返回selectQuery 对象 作用：查询节点信息
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect(); // 查询.movable-area组件中的信息 
      query.select('.movable-view').boundingClientRect();
      // 将查询结果以数组方式实现
      query.exec((rect) => {
      
        movableAreaWidth = rect[0].width;  // 获取小圆圈 【拖动的总位移】
        movableViewWidth = rect[1].width;  // 小圆圈 的宽度 定值
       

      })
    },
    bindBGMEvent() {
      backAudioManager.onCanplay((res) => { // 能播放
        // 坑 因为小程序里面；类似迟延的现象 ；为了获取到时间 所以 晚1s在获取音频时间
        if (typeof backAudioManager.duration == 'undefined') {
          setTimeout(() => {
            this.setTime();
          }, 1000)
        } else {
          this.setTime()
        }

      })
      backAudioManager.onPlay((res) => { // 播放触发
        isMoving = false
        this.triggerEvent('musicPlay')
      })

      backAudioManager.onStop((res) => { //停止播放
        console.log('onStop')
      })
      backAudioManager.onPause((res) => {  // 暂停
        console.log('onPaused')
        this.triggerEvent('musicPause')
      })
      backAudioManager.onWaiting((res) => {
        console.log('onWaiting')
      })

      backAudioManager.onTimeUpdate((res) => { // 播放时间更新时候
        // 如果没有拖动 在进行 时间的更新
        if (!isMoving) {
          var currentTime = backAudioManager.currentTime; // 播放时间
          var duration = backAudioManager.duration;       // 总时间
          var sec = currentTime.toString().split('.')[0]

          // 优化处理, 解决：1s 内 多次调用this.setData 问题；--> 1s 调用1次
          if (sec != currentSec) {

            var currentTimeFmt = this.dateFormat(currentTime);
            this.setData({
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100
            })
            currentSec = sec

            // 联动歌词
            this.triggerEvent('timeUpdate',{
              currentTime
            })
          }
        }


      })

      backAudioManager.onEnded((res) => { // 歌曲播放完成时候
        console.log('onEnded')
        // 当音乐播放完之后；自动切换到下一首
        this.triggerEvent('musicEnd')
      })
      backAudioManager.onError((res) => {
        wx.showToast({
          title: '错误' + res.errCode,
          icon: 'none',
        });
      })

    },

    // 获取总时长；并对时间格式化
    setTime() {
      duration = backAudioManager.duration  // 获取歌曲的总时长 126.66667秒
      const durationFmt = this.dateFormat(duration)
      // 坑： 更新总时间
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`,
      })

    },
    // 格式化时间  '00：00'
    dateFormat(sec) {
      var min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      return {
        'min': this.parse0(min),
        "sec": this.parse0(sec)
      }
    },
    // 时间取0的处理 
    parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})


/**
 * 
 */