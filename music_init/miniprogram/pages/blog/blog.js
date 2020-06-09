let keyword = '' // 表示索索条件
let db = wx.cloud.database();
// 获取数据的总长度 （建议在云函数中做）
let blogCount = 0

Page({
  data: {
    modalShow: false,  // 控制底部弹出层显示隐藏
    blogList: [],       // 表示博客列表
    isReachBottom: false,   // 是否显示没有跟多数据了
    isNolist: false   // 是否显示么有跟多搜索结果
  },
  // 发布功能
  onPublish() {
    // 判断用户是否授权  
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) { // 授权
          // 获取用户信息
          wx.getUserInfo({
            success: (res) => {
              // 表是登录成功；执行登录成功的方法
              this.onloginSuccess({
                detail: res 
              });
            },
          });
        } else {
          // 没有授权；弹出底部弹出成；获取用户信息
          this.setData({
            modalShow: true,
          })
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },


  // 用户授权
  onloginSuccess(event) {
    // 带着用户信息 跳转到博客编辑页面
    const detail = event.detail.userInfo  // 获取login 传入的userInfo

    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nicName=${detail.nickName}&avataUrl=${detail.avatarUrl}`,
    });
  },
  // 用户没授权
  onloginFail() {
    wx.showModal({
      title: '授权用户才能发布博客',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#1296db',
      success: (result) => {
        if (result.confirm) {

        }
      },
      
    });
  },

  onLoad: function (options) {
    this.loadBlogList()
    db.collection('blog').count().then((res) => {
      blogCount = res.total
    })
  },

  // 获取博客列表数据
  loadBlogList(start = 0) {
    wx.showLoading({
      title: '加载中....',
    });
    wx.cloud.callFunction({
      name: "blog",
      data: {
        keyword,
        start,
        count: 10,
        $url: 'list'
      }
    }).then((res) => {
      // 更新blogList
      this.setData({
        // 分页加载数据，--->累加过程 -->合并数组方式
        blogList: this.data.blogList.concat(res.result),
        isReachBottom: false,
        isNolist: false
      })
      wx.hideLoading();

    })
  },



  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList: []
    })
    this.loadBlogList()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 触底处理
    if (this.data.blogList.length == blogCount) {
      this.setData({
        isReachBottom: true
      })
      return
    }
    this.loadBlogList(this.data.blogList.length)
  },

  goComment(event) {
    wx.navigateTo({
      url: "/pages/blog-comment/blog-comment?blogId=" + event.currentTarget.dataset.blogid
    })
  },
  onSearch(event) {
    // 先清空 在加载搜索结果
    this.setData({
      blogList: [],
    })
    keyword = event.detail.keyword;// 搜索条件
    this.loadBlogList()
    // 当blogList 的长度为0 的时候；表示么有搜索到内容
    // ------> 等获取博客列表异步 结束时候 在进行判断
    setTimeout(() => {
      if (this.data.blogList.length === 0) {
        this.setData({
          isNolist: true
        })
      }
    }, 3000)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    let blogObj = event.target.dataset.blog
    // 配置当用户点击分享链接  
    return{
      title:blogObj.content,
      path:'/pages/blog-comment/blog-comment?blogId='+blogObj._id   // 跳转的页面
    }
  }
})