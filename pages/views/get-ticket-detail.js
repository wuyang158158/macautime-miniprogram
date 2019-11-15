// pages/views/get-ticket-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  // 立即领取
  tapNowGet() {
    wx.showModal({
      title: '提示',
      content: '优惠券仅供时光卡会员用户使用，现在开通，领取优惠券，还能享受更多会员增值优惠及特权。',
      cancelText: '再看看',
      cancelColor: '#999999',
      confirmText: '开通会员',
      confirmColor: '#00A653',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/views/spell-route-order-ok?route=get-ticket-detail' 
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})