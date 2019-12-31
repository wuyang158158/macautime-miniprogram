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
        platformName: '微博',
        account: 0,
        nickName: '',
        accountId: ''
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKolBaseInfo()
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
    var choseTag = wx.getStorageSync('choseTag')
    this.setData({
      choseTag: choseTag
    })
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
      platformName: '',
      account: 0,
      nickName: '',
      accountId: ''
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
    
    this.usKolOtherInfo()
    
    // 跳转到实名认证
    // wx.navigateTo({
    //   url: '/pages/views/real-name-authentication'
    // })
  },
  // 单列选择器
  bindPickerChange: function(e) {
    const index = e.currentTarget.dataset.index
    const platformList = this.data.platformList
    platformList.map((item,i)=>{
      if(i === index){
        item.account = e.detail.value
        item.platformName = this.data.array[e.detail.value]
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
        if(type === 'nickName'){
          item.nickName = e.detail.value
        }
        if(type === 'accountId'){
          item.accountId = e.detail.value
        }
      }
    })
    this.setData({
      platformList: platformList
    })
  },
  // 新增kol
  usKolOtherInfo() {
    // NT.showToast('处理中...')
    const userId = wx.getStorageSync("userInfo").userId
    const list = this.data.platformList
    let query = {
      accordingImage: 'https://wx.qlogo.cn/mmopen/vi_32/nOs9YyFciaKKSNIoWJrXibHGQoHeR33rvQ6T05h21Uzzx5crTu2OyHIADcfcNRfx9FPjUk633zpH37K3dHMlIwGw/132',
      kolOtherPlatformList: list,
      sysLabelList: this.data.choseTag
    }
    if(!query.sysLabelList.length){
      NT.showModal('请选择优势特长！')
      return
    }
    if(!query.accordingImage){
      NT.showModal('请上传个人形象照！')
      return
    }
    if(!query.kolOtherPlatformList.length){
      NT.showModal('请至少填写一个其它平台信息！')
      return
    }
    wx.navigateTo({
      url: '/pages/views/real-name-authentication',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('query', query)
      }
    })
  },
  // 获取kol用户信息
  getKolBaseInfo() {
    NT.showToast('加载中...')
    api.getKolBaseInfo({id:wx.getStorageSync("userInfo").userId})
    .then(res=>{
      this.setData({
        userInfo: res
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  // 上传图片
  tapChooseImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          accordingImage: tempFilePaths[0]
        })
        // api.userUploadImage(tempFilePaths[0])
        // .then(res=>{
        //   console.log(res)
        // })
        // .catch(err=>{
        //   console.log(err)
        // })
      }
    })
  },
  // 跳转到优势特长选择
  tapToSpeciality() {
    wx.navigateTo({
      url : '/pages/views/kol-tag'
    })
  },
})