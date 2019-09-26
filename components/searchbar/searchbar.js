// components/searchbar/searchbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchPlaceholder: {
      type: 'string',
      value: '搜索'
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    inputVal: ""
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 搜索组件相关
     */
    clearInput() {
      this.setData({
        inputVal: ""
      })
      this.triggerEvent('search', '')
    },
    inputTyping(e) {
      this.setData({
        inputVal: e.detail.value
      });
      this.triggerEvent('search', e.detail.value)
    },
    onParentEvent(event) {
      console.log(event)
      this.triggerEvent('search', event.detail.value)
    }
  }
})