// components/acMyList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: Object
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
    tapToDetail(e) { // 点击查看体验详情
      const ID = e.currentTarget.dataset.id
      const TITLE = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE
      })
    },
  }
})
