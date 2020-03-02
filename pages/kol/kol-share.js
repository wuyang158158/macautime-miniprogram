import api from "../../data/api"
import NT from "../../utils/native.js"
import util from "../../utils/util.js"
// pages/kol/kol-share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    openSum: false,
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    showDialog: false,
    result: {
      today: 0,
      total: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.selectSpreadAmount()
    this.selectSpreadList()
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
    const userInfo = this.data.userInfo
    let path = '/pages/views/vip-center'
    if(userInfo.isTalent == 2){
      path = '/pages/views/vip-center?speadCode=' + userInfo.spreadCode + '&speadType=' + userInfo.isTalent
    }
    return {
      path: path,
      title: '您有一张去澳门打卡必备的Macau Time会员待领取！',
      imageUrl: '/images/vip/share-vip.png'
    }
    console.log(path)
  },
  tapTODetail() {
    const today = this.data.result.today
    if(!today){
      NT.showToastNone('暂无数据！')
      return
    }
    this.setData({
      open: !this.data.open
    })
  },
  tapTODetailSum() {
    const total = this.data.result.total
    if(!total){
      NT.showToastNone('暂无数据！')
      return
    }
    this.setData({
      openSum: !this.data.openSum
    })
  },
  // 选择分享形式
  tapShareChose() {
    this.setData({
        istrue: true
    })
    // this.twoCode()
  },
  closeDialog: function () {
    this.setData({
        istrue: false
    })
  },
  twoCode() {
    if(this.data.imageUrl){
      const imageUrl = this.data.imageUrl
      wx.previewImage({
        current: imageUrl, // 当前显示图片的http链接
        urls: [imageUrl] // 需要预览的图片http链接列表
      })
      return false;
    }
    const userInfo = this.data.userInfo
    const query = {
      extensionId: userInfo.spreadCode,
      extensionType: userInfo.isTalent
    }
    api.twoCode(query)
    .then(res=>{
      console.log(res)
      const imageUrl = res.imageUrl
      this.setData({
        imageUrl: imageUrl
      })
      wx.previewImage({
        current: imageUrl, // 当前显示图片的http链接
        urls: [imageUrl] // 需要预览的图片http链接列表
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 查询kol分享数据总数
  selectSpreadAmount() {
    api.selectSpreadAmount()
    .then(res=>{
      console.log(res)
      this.setData({
        result: res
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  selectSpreadList() {
    api.selectSpreadList()
    .then(res=>{
      console.log(res)
      var allList = res.allList
      var cruuentList = res.cruuentList
      var cont = 1
      var contCruuent = 1
      allList.map(item=>{
        item.idx = cont++
        item.phoneStr = util.phoneReplace(item.phone)
      })
      cruuentList.map(item=>{
        item.idx = contCruuent++
        item.phoneStr = util.phoneReplace(item.phone)
      })
      console.log(allList)
      this.setData({
        allList: allList,
        cruuentList: cruuentList
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  }
})