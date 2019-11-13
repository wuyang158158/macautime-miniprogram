// pages/views/kol-enter.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAgreement: true,
    array: ['微博', '抖音', '快手', '微视'],
    platformList: [
      {
        platform: '微博',
        account: 0,
        platformNickName: '',
        numberOfFans: ''
      }
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
  radioChange(e) { //用户协议
    this.setData({
      userAgreement: e.detail.value.length > 0 ? true : false
    })
  },
  tapToAgreement() { //跳转到Macau Time协议
    // wx.navigateTo({
    //   url: '/pages/views/gh-agreement'
    // })
    wx.navigateTo({
      url: '/pages/views/about-us?id=2'
    })
  },
  // 添加平台信息
  tapAddPlatformMsg() {
    console.log('添加平台信息')
    const obj = {
      platform: '',
      account: 0,
      platformNickName: '',
      numberOfFans: ''
    }
    this.setData({
      platformList: this.data.platformList.concat(obj)
    })
  },
  // 删除详细信息
  tapDeletePlatformMsg(e) {
    const index = e.currentTarget.dataset.index
    const platformList = this.data.platformList
    platformList.map((item,i)=>{
      if(i === index){
        platformList.splice(i,1)
      }
    })
    this.setData({
      platformList: platformList
    })
  },
  // 点击下一波
  tapNext() {
    if(!this.data.userAgreement){
      NT.showToastNone('需要同意服务协议才能继续提交',2000)
      return
    }
    // NT.showToast('处理中...')
    // this.addKolAduit()
    
    // 跳转到实名认证
    wx.navigateTo({
      url: '/pages/views/real-name-authentication'
    })
  },
  // 单列选择器
  bindPickerChange: function(e) {
    const index = e.currentTarget.dataset.index
    const platformList = this.data.platformList
    platformList.map((item,i)=>{
      if(i === index){
        item.account = e.detail.value
        item.platform = this.data.array[e.detail.value]
      }
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      platformList: platformList
    })
  },
  bindinput(e) {
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.type
    const platformList = this.data.platformList
    platformList.map((item,i)=>{
      if(i === index){
        if(type === 'platformNickName'){
          item.platformNickName = e.detail.value
        }
        if(type === 'numberOfFans'){
          item.numberOfFans = e.detail.value
        }
      }
    })
    this.setData({
      platformList: platformList
    })
  },
  // 新增kol 审核
  addKolAduit() {
    const list = this.data.platformList
    api.addKolAduit({list:list})
    .then(res=>{
      console.log(res)
      wx.navigateTo({
        url: '/pages/views/kol-enter-msg'
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  }
})