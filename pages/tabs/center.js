// pages/tabs/center.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
const app = getApp()
const record = [{
  iconPath: '/images/center/mine_icon_like.png',
    text: '我的点赞'
  },
  {
    iconPath: '/images/center/mine_icon_comment.png',
    text: '我的评价'
  },
  {
    iconPath: '/images/center/mine_icon_history.png',
    text: '浏览记录'
  },
  {
    iconPath: '/images/center/mine_icon_video.png',
    text: '我的视频'
  },
  {
    iconPath: '/images/center/mine_icon_photo.png',
    text: '我的相册'
  },
  {
    iconPath: '/images/center/mine_icon_line.png',
    text: '我的路线'
  },
  {
    iconPath: '/images/center/mine_icon_card.png',
    text: '会员卡券'
  },
  {
    iconPath: '/images/center/mine_icon_wallet.png',
    text: '我的钱包'
  },
  {
    iconPath: '/images/center/mine_icon_store.png',
    text: '预约探店'
  },
  {
    iconPath: '/images/center/mine_icon_list.png',
    text: '我的发布'
  },
  {
    iconPath: '/images/center/mine_icon_push.png',
    text: '我要发布'
  }
];
const menu = [
  // {
  //   iconPath: '/images/center/mine_icon_message.png',
  //   text: '我的消息'
  // },
  {
    iconPath: '/images/center/mine_icon_service.png',
    text: '联系客服'
  },
  {
    iconPath: '/images/center/mine_icon_set.png',
    text: '更多设置'
  },
  {
    iconPath: '/images/center/mine_icon_suggestion.png',
    text: '意见反馈'
}];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    record: record,
    menu: menu
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // wx.navigateTo({
    //   url: '/pages/integral/time-coin-task'
    // })
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
    // console.log(this.data.userInfo)
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
  tapToLogin: function(e) {
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
                console.log(err)
                if(err.code==='10019'){ //用户未注册
                  wx.navigateTo({
                    url: '/pages/login/login?openId='+err.data.openId + '&sessionKey=' + err.data.sessionKey,
                    success: function(res) {
                      // 通过eventChannel向被打开页面传送数据
                      res.eventChannel.emit('acceptDataFromOpenerPage', err.data)
                    }
                  })
                }else{
                  NT.showModal(err.message||'登录失败！')
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
  tapToVipCenter() { // 点击进入会员介绍中心
    wx.navigateTo({
      url: '/pages/views/vip-center'
    })
  },
  tapToVipCenter() { // 点击进入会员介绍中心
    wx.navigateTo({
      url: '/pages/views/vip-center'
    })
  },
  tapToCenterDetail() { //进入个人中心详情
    wx.navigateTo({
      url: '/pages/views/center-detail'
    })
  },
  tapMenu(e) { //点击菜单
    const menu = e.currentTarget.dataset.menu
    // if(menu === '意见反馈'){
    //   wx.navigateTo({
    //     url: '/pages/views/feedback'
    //   })
    // }
    if(menu === '我的消息'){
      wx.navigateTo({
        url: '/pages/views/information'
      })
    }
    if(menu === '更多设置'){
      wx.navigateTo({
        url: '/pages/views/more-settings'
      })
    }
    if(menu === '浏览记录'){
      wx.navigateTo({
        url: '/pages/views/my-seen'
      })
    }
    if(menu === '我的评价'){
      wx.navigateTo({
        url: '/pages/views/my-exp-comment'
      })
    }
    if(menu === '我的点赞'){
      wx.navigateTo({
        url: '/pages/views/my-like'
      })
    }
    if(menu === '会员卡券'){
      wx.navigateTo({
        url: '/pages/coupon/my-coupon'
      })
    }
    if(menu === '我要发布'){
      wx.navigateTo({
        url: '/pages/route/release-route'
      })
    }
    if(menu === '我的钱包'){
      wx.navigateTo({
        url: '/pages/wallet/wallet-index'
      })
    }
  },
  // 跳转到时光币商城页面
  tapToTimeCoinStore() {
    wx.navigateTo({
      url: '/pages/integral/time-coin-store'
    })
  },
  // 跳转到个人主页
  tapTopagesPersonalHome() {
    wx.navigateTo({
      url: '/pages/views/personal-home'
    })
  },
  // 跳转到我的关注
  tapToMyFocusKol() {
    wx.navigateTo({
      url: '/pages/my/my-focus-kol'
    })
  },
  // 跳转到我的粉丝
  getFansList() {
    wx.navigateTo({
      url: '/pages/my/my-fans'
    })
  }
})