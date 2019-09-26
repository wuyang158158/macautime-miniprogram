// pages/views/order-detail.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import util from "../../utils/util.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleFrom: {}, //请求详情参数
    orderData: {}, //订单信息
    options: {}, //传递参数
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    console.log(options)
    const obj = {
      orderCode: options.orderCode,
      userName: options.userName
    }
    wx.setNavigationBarTitle({
      title: options.statusStr
    })
    this.data.roleFrom = obj
    this.setData({
      options: options
    })
    this.getOrderDetails()
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
  //请求详情
  getOrderDetails() {
    api.getOrderDetails(this.data.roleFrom)
    .then(res=>{
      const data = res;
      // data.chargeOffCode = res.chargeOffCode ? res.chargeOffCode.replace(/(.{4})/g, "$1 ") : ''
      data.orderTimeStamp = res.orderTimeStamp ? util.formatTimeTwo(data.orderTimeStamp,'Y/M/D h:m:s') : ''
      this.setData({
        orderData: data
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 联系商家
  tapCallMerchant() {
    wx.makePhoneCall({
      phoneNumber: this.data.orderData.merchantPhone
    })
  },
  // 跳转到评价页面
  tapToExpComment() {
    const orderData = this.data.orderData
    wx.navigateTo({
      url: '/pages/views/exp-comment',
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', orderData)
      }
    })
  }
})