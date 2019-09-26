// pages/views/submit-order.js
import api from "../../data/api";
import NT from "../../utils/native.js"
// import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    options: {}, // 提交订单信息
    orderCount: 1, //订单计数
    choseVip: false, // 默认不选中会员优惠
    userAgreement: true, //购买协议需要用户手动确认
    discountPrice: 0, //已优惠
    sPrice: 0, //总价
    ePrice: 0, //最终价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      console.log(data)
      const discount = Number(data.newOriginalPrice) / Number(data.originalPrice)
      data.discount = Number(discount.toFixed(2)) * 100
      this.setData({
        orderCount: Number(data.orderCount) || 1,
        options:data,
        userInfo: wx.getStorageSync("userInfo"), //用户信息
      })
      this.computedPrice()
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
  checkboxChange(e) { // 会员优惠
    this.setData({
      choseVip: e.detail.value.length > 0 ? true : false
    })
  },
  radioChange(e) { //用户协议
    this.setData({
      userAgreement: e.detail.value.length > 0 ? true : false
    })
  },
  //计算价格
  computedPrice() {
    const options = this.data.options;
    const orderCount = this.data.orderCount;
    const discountPrice = (options.originalPrice * orderCount)-(options.newOriginalPrice * orderCount);
    const sPrice = options.originalPrice * orderCount;
    const ePrice = options.newOriginalPrice * orderCount
    this.setData({
      discountPrice: discountPrice.toFixed(2),
      sPrice: sPrice.toFixed(2),
      ePrice: ePrice.toFixed(2)
    })
  },
  submitOrder() { //提交订单
    const that = this
    if(!this.data.userAgreement){
      NT.showToastNone('需要同意果核服务协议才能预定',2000)
      return
    }
    NT.showToast('处理中...')
    const data = this.data
    const saveOrderRequest = {
      expMealSerial: data.options.expMealSerial,
      expSerial: data.options.expSerial,
      linkman: data.userInfo.nickName,
      linkmanPhone: data.userInfo.phone,
      number: data.orderCount,
      price: data.ePrice,
      useDate: data.options.useDate,
      userName: data.userInfo.userName
    }
    api.saveOrder(saveOrderRequest)
    .then(res=>{
      console.log(res)
      if(Number(data.options.paymentType) === 1){ //线上支付
        const expPayOrderModel = {
          amount: data.ePrice ,
          billType: 'E',
          orderCode: res,
          payType: 'WXPAY_JSAPI', //支付类型（微信支付：WXPAY_APP，公众号支付或小程序支付：WXPAY_JSAPI，支付宝支付：ALIPAY_APP 
        }
        api.payOrder(expPayOrderModel)
        .then(res=>{
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success (res) {
              that.orderConfirmHandle()
            },
            fail (res) {
              console.log(res)
              NT.showModal('支付失败！')
            }
          })
        })
        .catch(err=>{
          NT.showModal(err.codeMsg||err.message||'请求失败！')
        })
      }else{
        that.orderConfirmHandle()
      }
            
    })
    .catch(err=>{
      if(err.codeMsg === '该用户不是会员'){
        NT.showModalPromise('您不是会员暂不能预定，是否立即加入会员立即享受体验优惠？')
        .then(()=>{
          wx.navigateTo({
            url: '/pages/views/vip-center'
          })
        })
        .catch(()=>{

        })
      }else{
        NT.showModal(err.codeMsg||err.message||'请求失败！')
      }
    })
  },
  tapToAgreement() { //跳转到果核协议
    wx.navigateTo({
      url: '/pages/views/gh-agreement'
    })
  },
  orderConfirmHandle() { //预定订单成功后
    app.globalData.ticket = true
    wx.showModal({
      title: '提示',
      content: '预定成功！',
      confirmText: '查看订单',
      confirmColor: '#00A653',
      cancelColor: '#222222',
      cancelText: '继续浏览',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.switchTab({
            url: '/pages/tabs/ticket'
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
          wx.navigateBack({
            delta: 2
          })
        }
      }
    })
  }
})