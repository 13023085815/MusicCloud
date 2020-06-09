let keyword = '';  // 表示搜索条件
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'请输入内容'
    }
  },


  data: {

  },

  methods: {
    onInput(event){
      keyword = event.detail.value

    },
    onSearch(){
      this.triggerEvent('search',{
        keyword,
      })
    },
  }
})
