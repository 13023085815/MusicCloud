import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */

  properties: {
    blog: {
      type: Object
    }
  },
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        // 对时间进行格式化处理 ---> 使用自定义时间个格式化插件
        this.setData({
          createTime: formatTime(new Date(val))
        })

      }
    }
  },

  data: {
    createTime: ''
  },
  methods: {
    onPreview(event){
      let {imgSrc,imgs} = event.target.dataset; 
      wx.previewImage({
        current: imgSrc,
        urls: imgs,

      });
    }
  }
})
