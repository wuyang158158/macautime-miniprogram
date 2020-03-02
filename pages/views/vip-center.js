// pages/views/vip-center.js
import util from "../../utils/util.js"
import api from "../../data/api.js"
import NT from "../../utils/native.js"
const ENV = api.ENV_CONFIG //环境类型
const app = getApp();
const equityList = [ //会员权益列表
  {
    bgPath: '/images/vip/vip_right1.png',
    text: '专属体验'
  },
  {
    bgPath: '/images/vip/vip_right2.png',
    text: '限时礼包'
  },
  {
    bgPath: '/images/vip/vip_right3.png',
    text: '超值优惠'
  },
  {
    bgPath: '/images/vip/vip_right4.png',
    text: '特权标识'
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    vipType: [], //会员类型
    equityList: equityList,  // 会员权益列表
    discounts: [], //会员优惠劵红包
    vImgUrls: [],  // 会员专享活动
    vipLoadding: false, //已开通会员等待中
    amount: 88, //金额
    type: 1,
    source: '',  //来源  promotion为推广人员进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      discounts: util.packedArray(this.data.discounts),
      userInfo: wx.getStorageSync("userInfo"),
      vipLoadding: wx.getStorageSync("vipLoadding") || '',
      source: options.source,
      options: options
    })
    // 扫码进入
    if(options.scene){
      let scene=decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      options.speadCode = scene.split("&")[0];
      options.speadType = scene.split('&')[1];
      //其他逻辑处理。。。。。
      var title = '会员中心'
      wx.setNavigationBarTitle({
        title: title
      })
      this.setData({
        options: options
      })
      this.getLimitTimeGift()
      this.getExtensionVipPriceByUserName()
    }else{
      var title = '会员中心'
      if(options.source === 'promotion'){
        this.getExtensionVipPriceByUserName()
        title = '推广中心'
      }else{
        this.getLimitTimeGift()
        this.data.options.speadType == 2 ? this.getExtensionVipPriceByUserName() : this.vipPriceList()
        if(this.data.vipLoadding){
          this.getUserInfo()
        }
        wx.setNavigationBarTitle({
          title: title
        })
      }
    }
    
    

    
    
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
      userInfo: wx.getStorageSync("userInfo")
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
    NT.showToast('刷新中...')
    this.getUserInfo()
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
  },
  vSwiperChange(e) { // 会员专属礼物滑动
    const current = e.detail.current
    this.data.vipType.forEach((v,i) => {
      if(Number(i) === current){
        this.setData({
          amount: v.price,
          type: v.type
        })
      }
    });
  },
  // 开通会员
  tapJoinVip(e) {
    const that = this;
    const roleFrom = {
      payType: 'WXPAY_JSAPI', //支付类型（微信支付：WXPAY_APP，公众号支付或小程序支付：WXPAY_JSAPI，支付宝支付：ALIPAY_APP"
      amount: this.data.amount, //支付金额
      billType: 'V', //账单类型（V为会员 ）
      vipType: this.data.type, //vip类型(0:免费体验会员；1:收费金会员；
      userName: this.data.userInfo.userName, //用户ID
      secretKey: '', //密钥

      orderCode: '', //订单号
      isTalent: this.data.userInfo.isTalent, //用户类型(0:普通用户；1:达人；2:KOL; 3:地推) ,
      num: 1,
      speadCode: this.data.options.speadCode, // 推广二维码
      speadType: this.data.options.speadType, //推广类型 //达人标识 1-达人 0-普通用户  2-KOL  3-地推
    }
    if(that.data.source === 'promotion'){
      console.log('购买推广会员')
      wx.navigateTo({
        url: '/pages/promotion/promotion-count-choice',
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: roleFrom })
        }
      })
      return false
    }
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
          if(that.data.source === 'promotion'){
            NT.showModal('恭喜您，购买成功！')
          }else{
            NT.showModal('恭喜您，开通会员成功！')
            wx.setStorage({
              key:"vipLoadding",
              data:"open"
            })
            that.setData({
              vipLoadding: true
            })
            that.data.options.speadType == 2 ? that.getExtensionVipPriceByUserName() : that.vipPriceList()
            that.getUserInfo()
          }
          
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
  //会员限时礼
  getLimitTimeGift() {
    let that = this
    api.getLimitTimeGift()
    .then(res=>{
      const data = res
      data.map(item => {
        let activityTagSplit = item.activityTag ? item.activityTag.split(',') : ''
        item.activityTag = item.activityTag ? activityTagSplit.length>1?[activityTagSplit[0],activityTagSplit[1]] : [activityTagSplit[0]] : ''
      })
      this.setData({
        vImgUrls: data
      })
      // console.log(item)
    })
    .catch(err=>{
      console.log(err)
    })
  },
  tapToDetail(e) { // 点击查看体验详情
    const ID = e.currentTarget.dataset.id
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE
    })
  },
  //获取用户信息
  getUserInfo() {
    const userFrom = {
      loginType: '1',
      phone: this.data.userInfo.phone,
      type: '1'
    }
    api.getUserInfo(userFrom)
    .then(res=>{
      console.log(res)
      const userInfo = Object.assign(wx.getStorageSync("userInfo")||{},res)
      if(userInfo.vip){
        wx.removeStorageSync('vipLoadding')
        this.setData({
          vipLoadding: false
        })
      }
      this.setData({
        userInfo: userInfo
      })
      wx.setStorage({
        key:"userInfo",
        data:userInfo
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  vipPriceList() { //请求会员价格
    api.vipPriceList()
    .then(res=>{
      console.log(res)
      const bgPath = '/images/vip/vip_card1.png'
      var vipType = []
      var amount = ''
      var type = ''
      res.map((item,index)=>{
        if(item.type == 1) {
          item.bgPath = bgPath
          amount = item.price
          type = item.type
          vipType.push(item)
        }
      })
      this.setData({
        vipType: vipType,
        amount: amount,
        type: type
      })
    //   let amount = 0
    //   let type = 0
    //   res.forEach(item=>{
    //     if(ENV === 'prod' && item.title === '正式会员'){ //生产环境使用正式会员，其余都为测试
    //       amount = item.price
    //       type = item.type
    //     }
    //     if(ENV !== 'prod' && item.title === '测试会员'){ //生产环境使用正式会员，其余都为测试
    //       amount = item.price
    //       type = item.type
    //     }
    //   })
    //   console.log(amount)
    //   this.setData({
    //     amount: amount,
    //     type: type
    //   })
    })
  },
  tapModelToLogin() {
    NT.showModal('需要登录!')
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
  capturecatchtouchmove() {
    return false;
  },
  // 购买推广会员
  tapJoinVipPromotion() {
  },
  // 根据推广人员标识获取推广会员价格
  getExtensionVipPriceByUserName() {
    NT.showToast('加载中...')
    api.getExtensionVipPriceByUserName({vipPriceType: this.data.options.speadType})
    .then(res=>{
      console.log(res)
      const bgPath = '/images/vip/vip_card1.png'
      res.bgPath = bgPath
      this.setData({
        vipType: [res],
        amount: res.price,
        type: res.type
      })
    })
    .catch(err=>{
      console.log(err)
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 跳转到推广次数页面
  tapPromotionCount() {
    wx.navigateTo({
      url: '/pages/promotion/promotion-count'
    })
  }
})