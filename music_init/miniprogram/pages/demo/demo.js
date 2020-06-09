// miniprogram/pages/demo/demo.js
Page({
  data:{
    progress:0,
    count:0
  },
  music(){
    wx.cloud.callFunction({
      name:'TcbRouter',
      data:{
        $url:'music'
      }
    }).then((res)=>{
    })
  },
  moview(){
    wx.cloud.callFunction({
      name:'TcbRouter',
      data:{
        $url:'movie'
      }
    }).then((res)=>{
      console.log(res)
    })
  },
  pro(){
    setTimeout(() => {
      var timer = setInterval(() => {
         this.setData({
          progress:++this.data.progress
         })
         if(this.data.progress ==100){
           clearInterval(timer)
         }
       }, 500)
     }, 2000)
  },
  add(){
    console.log("add执行了",this.data.count)
    this.setData({
      count:++this.data.count
    },()=>{
      console.log("回调执行了")
    })
    console.log("数据修改了",this.data.count)
  }
})