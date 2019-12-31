// pages/views/real-name-authentication.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女'],
    ageArray: [],
    identityQuery: {
      cardFrontImage: 'https://wx.qlogo.cn/mmopen/vi_32/nOs9YyFciaKKSNIoWJrXibHGQoHeR33rvQ6T05h21Uzzx5crTu2OyHIADcfcNRfx9FPjUk633zpH37K3dHMlIwGw/132',
      cardBackImage: 'https://wx.qlogo.cn/mmopen/vi_32/nOs9YyFciaKKSNIoWJrXibHGQoHeR33rvQ6T05h21Uzzx5crTu2OyHIADcfcNRfx9FPjUk633zpH37K3dHMlIwGw/132',
      gender: '',
      age: '',
      realName: '',
      identityType: '身份证',
      identityCode: ''
    }, //上传参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('query', function(data) {
      console.log(data)
      that.setData({
        query: data
      })
    })

    let ageArray = []
    for (let index = 1; index < 100; index++) {
      ageArray.push(index)
    }
    this.setData({
      ageArray: ageArray
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
  onShareAppMessage: function () {

  },
  // 单列选择器
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gender: e.detail.value
    })
  },
  bindPickerChangeAge(e) {
    console.log('picker发送选择改变age，携带值为', e.detail.value)
    this.setData({
      age: e.detail.value
    })
  },
  // 跳转去绑定银行卡页面
  tapToBindBankCard() {
    wx.navigateTo({
      url: '/pages/views/bind-bank-card'
    })
  },
  // 上传身份证正反面
  tapChooseImage(e) {
    const type = e.currentTarget.dataset.type
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        if(type==='front'){
          that.data.identityQuery.cardFrontImage = tempFilePaths
        }else{
          that.data.identityQuery.cardBackImage = tempFilePaths
        }
        
        // api.userUploadImage(tempFilePaths)
        // .then(res=>{
        //   console.log(res)
        // })
        // .catch(err=>{
        //   console.log(err)
        // })
      }
    })
  },
  // 下一步
  formSubmit(e) {
    const that = this
    let params = e.detail.value
    let data = Object.assign(this.data.identityQuery, params)
    if(!data.realName){
      NT.showModal('请输入真实姓名！')
      return
    }
    if(!data.sex){
      NT.showModal('请选择年龄！')
      return
    }
    if(!data.gender){
      NT.showModal('请选择性别！')
      return
    }
    if(!data.identityCode){
      NT.showModal('请输入身份证！')
      return
    }
    if(!data.cardFrontImage){
      NT.showModal('请上传身份证正面图！')
      return
    }
    if(!data.cardBackImage){
      NT.showModal('请上传身份证反面图！')
      return
    }
    data.sex === '男' ? 0 : 1
    NT.showToast('处理中...')
    api.usInsertIdentity(data)
    .then(res=>{
      NT.showToast('处理中...')
      api.usKolOtherInfo(that.data.query)
      .then(res=>{
        console.log(res)
        wx.navigateTo({
          url: '/pages/views/kol-enter-msg'
        })
        wx.removeStorageSync('choseTag')
      })
      .catch(err=>{
        NT.showModal(err.message||'请求失败！')
      })
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
    
  }
})