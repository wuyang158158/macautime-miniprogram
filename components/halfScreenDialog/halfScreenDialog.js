// components/halfScreenDialog/halfScreenDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
			type: Object,
			value: {}
		},
    istrue: {
			type: Boolean,
			value: false
		}
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
    closeDialog: function () {
        this.setData({
            istrue: false
        })
        this.triggerEvent('closeDialog', false)
    },
  }
})
