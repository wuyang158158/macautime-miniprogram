// pages/views/more-settings.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
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

  // },
  tapToCenterDetail() { //进入个人中心详情
    wx.navigateTo({
      url: '/pages/views/center-detail'
    })
  },
  tapToAccountManagement() { //进入到账号管理
    wx.navigateTo({
      url: '/pages/views/account-management'
    })
  },
  tapToAboutUs(e) { // 跳转到关于我们
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/views/about-us?id=' + id
    })
  }
})