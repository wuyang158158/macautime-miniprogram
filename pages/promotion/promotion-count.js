// pages/promotion/promotion-count.js
import api from "../../data/api"
import NT from "../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionModel: false,
    mobile: '', // 手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
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
    this.ExtensionAmount()
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
  ExtensionAmount() {
    NT.showToast('加载中...')
    api.ExtensionAmount()
    .then(res=>{
      this.setData({
        result: res
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 购买推广会员
  tapPromotionOpenVip() {
    this.setData({
      promotionModel: true
    })
  },
  tapModelClose() {
    this.setData({
      promotionModel: false
    })
  },
  tapToPromotion() {
    wx.navigateTo({
      url: '/pages/views/vip-center?source=promotion' + '&speadType=' + this.data.userInfo.isTalent
    })
  },
  // 提交表单
  formSubmit(e) {
    console.log(e)
    const that = this
    const mobile = e.detail.value.mobile.trim()
    if(!mobile){
      NT.showModal('请输入手机号码！')
      return false;
    }
    NT.showModalPromise('确认为该手机号码'+mobile+'开通会员吗？')
      .then(()=>{
        NT.showToast('处理中...')
        api.setVipByPhone({phone:mobile})
        .then(res=>{
          NT.showModalConfirm(res)
          .then(r=>{
            that.setData({
              promotionModel: false,
              mobile: false
            })
            that.ExtensionAmount()
          })
          
        })
        .catch(err=>{
          NT.showModal(err.codeMsg||err.message||'请求失败！')
        })
      })
      .catch(()=>{

      })
  },
  tapToLogin: function(e) { //登录
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success (res) {
              // 用户已经同意 后续调用 wx.getUserInfo 接口不会弹窗询问
              // 必须是在用户已经授权的情况下调用
              wx.getUserInfo()
            },
            fail () { //用户拒绝授权 则提示用户去授权
              wx.openSetting({
                success (res) {
                  console.log(res.authSetting)
                  res.authSetting = {
                    "scope.userInfo": true,
                    "scope.userLocation": true
                  }
                }
              })
            }
          })
        }else{
          // 必须是在用户已经授权的情况下调用
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              api.login()
              .then((res) => {
                that.setData({
                  userInfo: res
                })
                wx.setStorage({
                  key:"userInfo",
                  data:res
                })
              })
              .catch((err)=>{
                if(err.code==='10019'){ //用户未注册
                  wx.navigateTo({
                    url: '/pages/login/login?openid='+err.data.miniProgram + '&unionid=' + err.data.wxUnionid
                  })
                }else{
                  NT.showModal(err.codeMsg||'登录失败！')
                }
              })
            },
            fail : function(err) {
              console.log(err)
            }
          })
        }
      }
    })
  },
})