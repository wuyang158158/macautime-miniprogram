// components/searchbar/searchbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchPlaceholder: {
      type: 'string',
      value: '搜索体验'
    },
    disabled: {
      type: 'Boolean',
      value: false
    },
    source: { //来源
      type: 'string',
      value: ''
    },
    inputVal: {
      type: 'string',
      value: ''
    },
    inputShowed: {
      type: 'Boolean',
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    inputVal: "",
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
        inputVal: "",
        inputShowed: true
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
      this.triggerEvent('bindconfirm', event.detail.value)
    },
    onParentEvent1() {
      this.triggerEvent('bindconfirm', this.data.inputVal)
    },
    tapToSearch() {
      this.triggerEvent('tapSearch')
    },
    showInput: function () {
      this.setData({
          inputShowed: true
      });
    },
    hideInput: function () {
        this.setData({
            inputVal: ""
        });
        wx.navigateBack({
          delta: 1
        })
    }
  }
})