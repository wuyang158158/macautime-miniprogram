// components/dialogInput/dialogInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowConfirm: {
      type: 'Boolean',
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setValue: function (e) {
      this.setData({
        walletPsd: e.detail.value
      })
      this.triggerEvent('bindinput', e.detail.value)
    },
    cancel: function () {
      var that = this
      that.setData({
        isShowConfirm: false,
      })
    },
    confirmAcceptance:function(){
      var that = this
      that.setData({
        isShowConfirm: false,
      })
      this.triggerEvent('confirm', this.data.walletPsd)
    },
  }
})
