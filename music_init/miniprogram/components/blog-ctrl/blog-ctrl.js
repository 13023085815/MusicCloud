let userInfo = {};  // 用户信息
let db = wx.cloud.database();
Component({
  properties: {
    blogId: String,
    blog:{
      type:Object
    }
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, // 登录组件是否显示
    modalShow: false, // 控制评论是否显示
    content: '',      // 表示用户输入的评价信息
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {  // 授权
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论的弹框
                this.setData({
                  modalShow: true
                })
              },
            });
          } else {
            this.setData({
              loginShow: true
            })
          }
        },
        fail: () => { },
        complete: () => { }
      });
    },
    onLoginsuccess(event) {
      userInfo = event.detail.userInfo
      // 授权成功，授权框消失，评论框显示
      // ----> 注意先后顺序 ,this.setData 参二：是回调函数；这个函数是在 参一数据更新完毕后再执行的
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    // 授权失败
    onLoginfail() {
      wx.showModal({
        title: '授权的用户才能进行评价',
        content: '',
      });
    },
    // onImput(event){
    //   this.setData({
    //     content:event.detail.value
    //   })
    // },
    onsend(event) {
      console.log(event)

      // 插入数据库  用户信息  评论内容  博客ID  评论的时间
      let content = event.detail.value.content;
      let formId = event.detail.formId;  // 具有唯一性 推送模板消息的时候需要用到
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: ''
        })
        return
      }
      wx.showLoading({
        title: "评论中...",
        mask: true
      })
      db.collection("blog-comment").add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res) => {
        // 订阅消息推送 ****  -->先授权订阅 再发布订阅消息
        // 授权订阅  授权成功后
        
        // wx.requestSubscribeMessage({
        //   tmplIds:['W7C5mZkD-j_IZ9wLlWUZJ9XSNinIi_QvPo6VdMssL4I'],
        //   success:(res)=>{
        //     console.log(res)
        //   },
        //   fail:()=>{}
        // })

        // 再发布订阅消息
        // wx.cloud.callFunction({
        //   name:'sendmessage',
        //   data:{
        //     content,
        //     nickName:userInfo.nickName,
        //     blogId:this.properties.blogId,
        //     // formId:event.detail.formId
        //   }
        // }).then(res=>{
        //   console.log(res)
        // })


        wx.hideLoading();
        wx.showToast({
          title: '评论成功',
          duration: 1500,
        });
        this.setData({
          modalShow: false,
          content: ''  // 数据双向绑定
        })

        // 父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })
    }
  }
})
