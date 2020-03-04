// pages/wallet/wallet-index.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
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
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.atsSelect()
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
    this.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 请求数据
  atsSelect() {
    const that = this
    NT.showToast('加载中...')
    api.atsSelect()
    .then(res=>{
      that.setData({
        result: res
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 跳转到详情
  tapToDetail() {
    wx.navigateTo({
      url: '/pages/wallet/billing-details'
    })
  }
})