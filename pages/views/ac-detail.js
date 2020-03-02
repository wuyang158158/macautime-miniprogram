import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
import config from '../../data/api_config.js'
const env = config.env[config.curEnv]
const baseUrl = env.baseUrlImg
const time = util.formatTimeTwo(new Date(),'Y-M-D') //今日时间

// pages/views/ac-detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
    roleFrom: {}, //请求详情参数
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    acData: '', //详情数据
    markers: [{ //定位信息
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园',
      iconPath: '/images/detail/map_icon_logo.png',
      width: '52rpx',
      height: '62rpx',
      callout: {
        content: '',
        color: '#FF0000',
        fontSize: 15,
        borderRadius: 1,
        display: 'ALWAYS',
      }
    }],
    vImgUrls: [], // 会员限时礼体验列表
    recommend: false, //是否有喜欢推荐
    noData: false, //缺省页面
    type: 'video', //媒体展示默认视频
    current: 0,
    direction: 'vertical', // 视频播放默认垂直
    expAllMeal: [], //套餐列表
    source: '', //来源是否是vip
    items: [
      { name: '1168', value: '水舞间亲子票1大1小 B区20:00场 1069元', checked: true },
      { name: '1698', value: '水舞间亲子票2大1小 B区20:00场 1599元' },
      { name: '638', value: '水舞间成人票1张 B区20:00场  539元' },
      { name: '1168', value: '水舞间成人票2张 B区20:00场  1069元' },
    ],
    amount: '1168',
    date: time,
    time: time,
    istrueBay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // NT.showToast('加载中...')
    // console.log(options)
    wx.setNavigationBarTitle({
      title: options.title
    })
    const source = options.source
    this.setData({
      recommend: options.recommend,
      source: options.source,
      roleFrom: {
        expSerial: options.id,
        userName: this.data.userInfo.userName
      },
      queryExpCommentForm:{ //评论分页
        expId: options.id,
        pageSize: PAGE.limit,
        page: PAGE.start,
      }
    })
    if(source !== 'vip'){
      this.getExpDetails()
    }else{
      const bannarUrls = [
        baseUrl + '/images/01.jpg',
        baseUrl + '/images/02.jpg',
        baseUrl + '/images/03.jpg',
        baseUrl + '/images/04.jpg',
        baseUrl + '/images/05.jpg',
        baseUrl + '/images/06.jpg',
      ]
      this.setData({
        acData: {
          bannarUrls: bannarUrls,
          sharePic: baseUrl + '/images/01.jpg',
          activityTitle: options.title
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video')
    this.mapCtx = wx.createMapContext('myMap')
    // this.videoContext.play()
    // this.videoContext.pause()
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
    NT.showToast('加载中...')
    this.setData({
      queryExpCommentForm:{ //评论分页
        expId: this.data.queryExpCommentForm.expId,
        pageSize: PAGE.limit,
        page: PAGE.start,
      }
    })
    this.getExpDetails()
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
    const acData = this.data.acData;
    var path = '/pages/login/login?id=' + acData.experienceSerial + '&title=' + acData.activityTitle + '&shareType=acDetail';
    if(this.data.source === 'vip'){
      path = '/pages/views/ac-detail?id=' + '&title=' + acData.activityTitle + '&source=vip';
    }
    console.log(path)
    return {
      path: path,
      title: acData.activityTitle,
      imageUrl: acData.sharePic||acData.coverUrl
    }
  },
  tapToVipCenter() { // 点击进入会员介绍中心
    wx.navigateTo({
      url: '/pages/views/vip-center'
    })
  },
  //滑动
  swiperHandle(e) {
    console.log(e)
    const current = e.detail.current
    this.setData({
      current: current
    })
    if(this.data.acData.videoUrl&&current===0){
      this.videoContext.play()
    }else{
      this.videoContext.pause()
    }
  },
  // 视频进入和退出全屏时触发
  bindfullscreenchange(e) {
    const direction = e.detail.direction
    console.log(e)
    this.setData({
      direction: direction
    })
  },
  //获取详情数据
  getExpDetails() {
    api.getExpDetails(this.data.roleFrom)
    .then(res=>{
      this.getExpAllMeal() //获取套餐接口
      const data = res
      const location = { //定位信息
        latitude: data.lat,
        longitude: data.lng,
        name: data.addr
      }
      data.activityTag = data.activityTag ? data.activityTag.split(',') : ''
      data.bannarUrls = data.bannarUrls ? data.bannarUrls.split('|') : ''
      data.stimeStr = data.stimeStr || data.stime ? util.formatTimeTwo(Number(data.stimeStr) || data.stime,'Y/M/D') : ''
      data.etimeStr = data.etimeStr || data.etime ? util.formatTimeTwo(Number(data.etimeStr) || data.etime,'Y/M/D') : ''
      data.activityDetails =  data.activityDetails ? data.activityDetails.replace(/\<img/gi, '<img style="border-radius: 8px;" ') : ''
      data.bookings = data.bookings ? data.bookings.replace(/\<img/gi, '<img style="border-radius: 8px;" ') : ''
      data.markers = this.data.markers ? [Object.assign(this.data.markers[0],location)] : ''
      data.newOriginalPrice = data.originalPrice && data.discount ? util.discountPrice(data.originalPrice,data.discount) : ''
      data.daysBetween = util.daysBetween(data.stimeStr,data.etimeStr)
      // console.log(data.newOriginalPrice)
      data.videoUrl = this.data.userInfo.isKol ? data.videoUrl : ''
      this.setData({
        acData: data
      })
      if(this.data.recommend){
        this.getGuessLike() //获取推荐喜欢数据
      }
      //查询评论
      this.queryExpComment()
    })
    .catch(err=>{
      console.log(err)
      this.setData({
        noData: {
          text: err.codeMsg ||'请求失败！',
          type: err.code === '00'? 'no-network' : 'no-data'
        }
      })
      // NT.showModal(err.codeMsg||'请求失败！')
    })
  },
  // 查询评论
  queryExpComment() {
    api.queryExpComment(this.data.queryExpCommentForm)
    .then(res=>{
      console.log(res)
      this.setData({
        expComment: res || {}
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  // 获取套餐类型
  getExpAllMeal() {
    api.getExpAllMeal(this.data.roleFrom)
    .then(res=>{
      // console.log(res)
      const meal = res.meal || []
      const lowestPrice = res.lowestPrice
      let upperPrice = 0
      meal.map(item=>{
        if(item.vipPrice === lowestPrice){
          upperPrice = item.price
        }
      })
      this.setData({
       expAllMeal: meal,
       lowestPrice: lowestPrice,
       upperPrice: upperPrice
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  //获取猜你喜欢推荐数据
  getGuessLike() {
    api.getGuessLike({userName:this.data.userInfo.userName})
    .then(res=>{
      const data = res
      data.map(item => {
        // debugger
        // item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D h:m:s')
        item.activityTag = item.activityTag ? item.activityTag.split(',') : ''
      })
      this.setData({
        vImgUrls: data
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  //打开地图
  openLocation() {
    const markers = this.data.acData.markers[0]
    wx.openLocation({
      latitude: Number(markers.latitude),
      longitude: Number(markers.longitude),
      name: markers.addr,
      scale: 18
    })
  },
  openLocation1() {
    wx.openLocation({
      latitude: 22.145470,
      longitude: 113.571960,
      name: '澳门路氹连贯公路新濠天地',
      scale: 18
    })
  },
  tapToDetail(e) {
    const ID = e.currentTarget.dataset.id
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE + '&recommend=true'
    })
  },
  //切换展示媒体
  tapMedia(e) {
    const current = Number(e.currentTarget.dataset.current)
    this.setData({
      current: current
    })
  },
  //预览图片
  tapPreviewImage(e){
    const item = e.currentTarget.dataset.item
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: this.data.acData.bannarUrls // 需要预览的图片http链接列表
    })
  },
  tapPreviewImage1(e) {
    wx.previewImage({
      current: baseUrl + '/images/time_01.jpg',// 当前显示图片的http链接
      urls: [
        baseUrl + '/images/time_01.jpg',
        baseUrl + '/images/time_02.jpg',
      ] // 需要预览的图片http链接列表
    })
  },
  tapToLogin(e) {
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
  // 跳转到体验日历
  tapToActivityCalendar() {
    wx.navigateTo({
      url: '/pages/views/calendar-activity'
    })
  },
  // 点击喜欢
  tapLike() {
    NT.showToast('处理中...')
    const likeForm = {
      expId: this.data.acData.experienceSerial,
      type: this.data.acData.isLike ? 1 : 0
    }
    api.likeExp(likeForm)
    .then(res=>{
      this.data.acData.isLike = !this.data.acData.isLike
      this.setData({
        acData: this.data.acData
      })
      NT.toastFn(this.data.acData.isLike ? '已收藏！' : '已取消！',1000)
    })
    .catch(err=>{
      console.log(err)
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 获取套餐详情
  getMealDetails(e) {
    if(!e){
      NT.showToastNone('请选择正确的套餐！',1000)
      return
    }
    const mealDetailsForm = {
      expMealSerial: e,
      expSerial: this.data.acData.experienceSerial
    }
    api.getMealDetails(mealDetailsForm)
    .then(res=>{
      this.setData({
        mealDetailResult: res,
        istrue: true
      })
      this.videoContext.pause()
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 关闭half-screen-dialog
  closeDialog(e){
    this.setData({
      istrue: false
    })
    if(this.data.acData.videoUrl&&this.data.current===0){
      this.videoContext.play()
    }
  },
  //点击查看套餐详情
  tapShowMealDetail(e){
    const mealserial = e.currentTarget.dataset.mealserial
    // NT.showToast('加载中...')
    this.getMealDetails(mealserial)
  },
  // 跳转到套餐页面
  tapToSetMeal(e) {
    const that = this
    const expAllMeal = this.data.expAllMeal
    const acData = this.data.acData
    const params = {
      expAllMeal: expAllMeal, //套餐
      acData: acData, // 详情相关数据
    }
    const mealSerial = e.currentTarget.dataset.mealserial ? e.currentTarget.dataset.mealserial : expAllMeal[0].mealSerial
    wx.navigateTo({
      url: '/pages/views/set-meal?mealSerial=' + mealSerial,
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', params)
      }
    })
  },
  // 领取体验
  tapGetEx() {
    NT.showToast('处理中...')
    const acData = this.data.acData
    const expAllMeal = this.data.expAllMeal
    const saveDisCountOrderForm = {
      expMealSerial: expAllMeal[0].mealSerial,
      expSerial: acData.experienceSerial
    }
    api.saveDisCountOrder(saveDisCountOrderForm)
    .then(res=>{
      console.log(res)
      acData.isBuyed = true;
      this.setData({
        acData: acData
      })
      NT.showModalPromise('领取成功，是否查看订单详情？')
        .then(()=>{
          wx.navigateTo({
            url: '/pages/views/ticket-detail?orderCode=' + res + '&userName=' + this.data.userInfo.userName
          })
        })
        .catch(()=>{

        })
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
  //点击查看全部评论
  tapToAllExpComment() {
    wx.navigateTo({
      url: '/pages/views/all-exp-comment?expId=' + this.data.queryExpCommentForm.expId,
    })
  },
  // 预览图片
  previewImage: function(e){
    // console.log(e)
    const comment = e.currentTarget.dataset.comment
    const expComment = this.data.expComment
    let urls = []
    expComment.map(item => {
      if(item.id === comment){
        item.imgUrl.map(element=>{
          urls.push(element.imgUrl)
        })
      }
    });
    // console.log(urls)
    // debugger
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
    })
  }, 
  radioChange(e) {
    console.log(e)
    this.setData({
      amount: e.detail.value
    })
  },
  submitBay(e) {
    console.log(e)
    const userInfo = this.data.userInfo
    if(userInfo.vip){
      NT.showModal('抱歉，此优惠仅限新用户购买！')
      return
    }
    var amount = e.detail.value.amount
    var realName = e.detail.value.realName
    var phone = e.detail.value.phone
    var email = e.detail.value.email
    var presenceTime = e.detail.value.presenceTime
    if(!amount){
      NT.showToastNone('请选择套餐！')
      return
    }
    if(!realName){
      NT.showToastNone('请输入您的姓名！')
      return
    }
    if(!phone){
      NT.showToastNone('请输入您的手机号码！')
      return
    }
    if(!email){
      NT.showToastNone('请输入您的电子邮箱！')
      return
    }
    if(!presenceTime){
      NT.showToastNone('请选择您的出现日期！')
      return
    }
    var noData = [
      '2020-01-06',
      '2020-01-07',
      '2020-01-08',
      '2020-01-14',
      '2020-01-15',
      '2020-01-21',
      '2020-01-22',
      '2020-01-23',
      '2020-01-29',
      '2020-02-04',
      '2020-02-05',
      '2020-02-11',
      '2020-02-12',
      '2020-02-18',
      '2020-02-19',
      '2020-02-25',
      '2020-02-26',
      '2020-03-03',
      '2020-03-04',
      '2020-03-10',
      '2020-03-11',
      '2020-03-17',
      '2020-03-18',
      '2020-03-19',
      '2020-03-20',
      '2020-03-21',
      '2020-03-22',
      '2020-03-23',
      '2020-03-24',
      '2020-03-25',
      '2020-03-26',
      '2020-03-27',
      '2020-03-28',
      '2020-03-29',
      '2020-03-30',
      '2020-03-31',
      '2020-04-01',
      '2020-04-02',
      '2020-04-07',
      '2020-04-08',
      '2020-04-14',
      '2020-04-15',
      '2020-04-21',
      '2020-04-22',
      '2020-04-28',
      '2020-04-29',
      '2020-05-05',
      '2020-05-06',
      '2020-05-12',
      '2020-05-13',
      '2020-05-19',
      '2020-05-20',
      '2020-05-26',
      '2020-05-27',
      '2020-06-02',
      '2020-05-03',
      '2020-05-09',
      '2020-05-10',
      '2020-05-16',
      '2020-05-17',
      '2020-05-23',
      '2020-05-24',
      '2020-05-30',
    ]
    if(noData.indexOf(presenceTime)!== -1){
      NT.showModal('抱歉，不能选择该日期，请选择其他日期！')
      return
    }
    var items = this.data.items
    var description = ''
    items.map(item=>{
      if(item.name == amount){
        description = item.value
      }
    })
    var payQuery = {
      // "amount": '0.01',   //支付金额
      "amount": config.curEnv === 'dev' ? '0.01' : amount,   //支付金额
      "billType": "S", //账单类型（V为会员,S为商品 ）
      "description": description, // 套餐描述 
      "email": email, // 邮箱
      "isTalent": userInfo.isTalent, // 用户类型(0:普通用户；1:达人；2:KOL; 3:地推) ,
      "num": "", //地推人员一次购买的次数
      "orderCode": "", //订单号
      "payType": "WXPAY_JSAPI", //支付类型（微信支付：WXPAY_APP，公众号支付或小程序支付：WXPAY_JSAPI
      "phone": phone, //电话号码
      "presenceTime": presenceTime, //入场时间
      "realName": realName, //身份证姓名
      "secretKey": "", //Secret Key
      "speadCode": "", //推广码
      "speadType": "", //达人标识 1-达人 0-普通用户 2-KOL 3-地推 ,
      "userName": this.data.userInfo.userName, //用户名
      "vipType": "1" // vip类型(0:免费体验会员；1:正式金会员；)
    }
    // debugger
    this.createShopPayOrder(payQuery)
  },
  // 购买水舞间门票接口
  createShopPayOrder(query) {
    var that = this;
    api.createShopPayOrder(query)
    .then(res=>{
      console.log(res)
      if(res.code == '00000'){
        var res = res.data
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success (res) {
            NT.showModal('恭喜您，购买成功！')
            that.getUserInfo()
          },
          fail (res) {
            console.log(res)
            // NT.showModal('支付失败！')
          }
        })
      }else{
        NT.showModal(res.codeMsg||res.message||'请求失败！')
      }
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  taptoBay() {
    this.setData({
      istrueBay: true
    })
  },
  closeDialogBay() {
    this.setData({
      istrueBay: false
    })
  },
  bindDateChange: function(e) {
      this.setData({
          date: e.detail.value
      })
      console.log(e)
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

})