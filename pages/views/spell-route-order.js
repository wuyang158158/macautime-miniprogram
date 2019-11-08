import { BMapWX } from "../../utils/bmap-wx.min"

// pages/views/spell-route-order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'A', value: '水舞间 A 区  $1000' },
      { name: 'B', value: '水舞间 B 区  $800', checked: 'true' },
      { name: 'C', value: '水舞间 C 区  $500' },
      { name: 'D', value: '水舞间 D 区  $200' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  // 下一步
  submitNext() {
    wx.navigateTo({
      url: '/pages/views/submit-order'
    })
  }
})