import NT from "../../utils/native.js"
import api from "../../data/api"
import util from "../../utils/util.js"
const tradeTypeArray = [
  {
    tradeType: 1,
    TradeTypeText: '充值'
  },
  {
    tradeType: 2,
    TradeTypeText: '提现'
  },
  {
    tradeType: 3,
    TradeTypeText: '探店'
  },
  {
    tradeType: 4,
    TradeTypeText: '活动'
  },
  {
    tradeType: 5,
    TradeTypeText: '粉丝返点'
  },
  {
    tradeType: 6,
    TradeTypeText: '购劵'
  },
  {
    tradeType: 7,
    TradeTypeText: '消费'
  },
  {
    tradeType: 8,
    TradeTypeText: '积分兑换'
  },
  {
    tradeType: 9,
    TradeTypeText: '会员'
  },
  {
    tradeType: 10,
    TradeTypeText: '优惠换提成'
  },
  {
    tradeType: 11,
    TradeTypeText: '消费提成'
  },
  {
    tradeType: 12,
    TradeTypeText: '退回'
  },
  {
    tradeType: 13,
    TradeTypeText: '核销'
  }
]
// pages/wallet/billing-details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradeTypeArray: tradeTypeArray
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.atsSelectByList()
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
  onShareAppMessage: function () {

  },
  // 请求钱包流水
  atsSelectByList() {
    const that = this
    NT.showToast('加载中...')
    api.atsSelectByList()
    .then(res=>{
      var result = res
      result.forEach(item => {
        item.ctime = util.formatTimeTwo(item.UpdateTime,'Y/M/D h:m:s')
        let key = item.TradeType
        switch (key) {
          case 1:
            item.TradeTypeText = '充值';
            break;
          case 2:
            item.TradeTypeText = '提现';
            break;
          case 3:
            item.TradeTypeText = '探店';
            break;
          case 4:
            item.TradeTypeText = '活动';
            break;
          case 5:
            item.TradeTypeText = '粉丝返点';
            break;
          case 6:
            item.TradeTypeText = '购劵';
            break;
          case 7:
            item.TradeTypeText = '消费';
            break;
          case 8:
            item.TradeTypeText = '积分兑换';
            break;
          case 9:
            item.TradeTypeText = '会员';
            break;
          case 10:
            item.TradeTypeText = '优惠换提成';
            break;
          case 11:
            item.TradeTypeText = '消费提成';
            break;
          case 12:
            item.TradeTypeText = '退回';
            break;
          case 13:
            item.TradeTypeText = '核销';
            break;
          default:
            item.TradeTypeText = '未知';
            break;
        }
      });
      that.setData({
        result: result
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 选择交易类型
  bindPickerChange(e) {
    console.log(e)
  }
})