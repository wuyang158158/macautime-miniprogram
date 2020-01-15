// pages/promotion/promotion-count-choice.js
import api from "../../data/api"
import NT from "../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCount: 1,
    roleFrom: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(res) {
      const data = res.data
      that.setData({
        roleFrom: data,
        amount: data.amount
      })
    })
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
  tapOrderDelete() { //减少订单
    this.setData({
      orderCount: this.data.orderCount > 1 ? this.data.orderCount - 1 : 1
    })
    // this.computedPrice()
  },
  tapOrderAdd() { //增加订单
    this.setData({
      orderCount: this.data.orderCount + 1
    })
    // this.computedPrice()
  },
  // 开通会员
  tapJoinVip(e) {
    const that = this;
    const roleFrom = this.data.roleFrom
    roleFrom.num = this.data.orderCount
    roleFrom.amount = this.data.orderCount * this.data.amount
    NT.showToast('处理中...')
    api.payVipOrder(roleFrom)
    .then(res=>{
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success (res) {
          NT.showModalPromise('恭喜您，购买成功，去兑换页面为用户开通吗？')
          .then(()=>{
            wx.navigateBack({
              delta: 2
            })            
          })
          .catch(()=>{

          })
        },
        fail (res) {
          console.log(res)
          // NT.showModal('支付失败！')
        }
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
})