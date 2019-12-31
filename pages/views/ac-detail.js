import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    // console.log(options)
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      msId: options.id,
      recommend: options.recommend,
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
    this.getExpDetails()
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
    return {
      path: '/pages/login/login?id=' + acData.experienceSerial + '&title=' + acData.activityTitle + '&shareType=acDetail',
      title: acData.activityTitle,
      imageUrl: acData.sharePic||acData.coverUrl
    }
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
    // api.getExpDetails(this.data.roleFrom)
    api.msSelectedMsDetailsByMsId({msId:this.data.msId})
    .then(res=>{
      // this.getExpAllMeal() //获取套餐接口
      const data = res
      const location = { //定位信息
        latitude: data.msBaseInfo.lat,
        longitude: data.msBaseInfo.lng,
        name: data.msBaseInfo.name
      }
      // data.activityTag = data.activityTag ? data.activityTag.split(',') : ''
      // data.bannarUrls = data.bannarUrls ? data.bannarUrls.split('|') : ''
      // data.stimeStr = data.stimeStr || data.stime ? util.formatTimeTwo(Number(data.stimeStr) || data.stime,'Y/M/D') : ''
      // data.etimeStr = data.etimeStr || data.etime ? util.formatTimeTwo(Number(data.etimeStr) || data.etime,'Y/M/D') : ''
      if(data.msIntroductionVo){
        data.msIntroductionVo.text =  data.msIntroductionVo.text ? data.msIntroductionVo.text.replace(/\<img/gi, '<img style="border-radius: 8px;" ') : ''
      }
      
      // data.msBaseInfo.remark = data.msBaseInfo.remark ? data.msBaseInfo.remark.replace(/\<img/gi, '<img style="border-radius: 8px;" ') : ''
      data.markers = this.data.markers ? [Object.assign(this.data.markers[0],location)] : ''
      // data.newOriginalPrice = data.originalPrice && data.discount ? util.discountPrice(data.originalPrice,data.discount) : ''
      // data.daysBetween = util.daysBetween(data.stimeStr,data.etimeStr)
      // console.log(data.newOriginalPrice)
      this.setData({
        acData: data
      })
      // if(this.data.recommend){
      //   this.getGuessLike() //获取推荐喜欢数据
      // }
      this.getGuessLike() //获取推荐喜欢数据
      this.msSelectedMsVideoByMsId() //相关视频
      //查询评论
      // this.queryExpComment()
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
    api.msSelectedMsListGuessYouLike()
    .then(res=>{
      const data = res
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
      scale: 15
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
      NT.showModal(err.codeMsg||err.message||'请求失败！')
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
  // 领券中心
  tapGetDiscounts(e) {
    // wx.navigateTo({
    //   url: '/pages/views/get-ticket-detail'
    // })
    const that = this
    const discountsCardId = e.currentTarget.dataset.discountscardid
    const wxPayQuery = {
      openId: that.data.userInfo.openId, //用户的openId
      orderNumber: '191226174252010500000', //商户订单号
      money: 1, //价格
      title: 'WXPAY_JSAPI', //商品名称
    }
    api.wxPay(wxPayQuery)
    .then(res=>{
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success (res) {
          console.log(res)
          NT.toastFn('领取成功！',1000)
          setTimeout(()=>{},1000)
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
    /*
    let payData = this.data.acData.msPayList
    let payName = ''
    let payId = ''
    payData.map(item=>{
      if(item.payName==='微信支付'){
        payName = item.payName
        payId = item.id
      }
    })
    const query = {
      amount: 1,
      accountId: this.data.userInfo.userId,
      msId: this.data.msId,
      payId: payId,
      payName: payName,
      id: discountsCardId
    }
    NT.showToast('领取中...')
    api.poInsertDiscountOrder(query)
    .then(res=>{
      const wxPayQuery = {
        openId: that.data.userInfo.openId, //用户的openId
        orderNumber: res.orderNumber, //商户订单号
        money: 1, //价格
        title: 'WXPAY_JSAPI', //商品名称
      }
      api.wxPay(wxPayQuery)
      .then(res=>{
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success (res) {
            console.log(res)
            NT.toastFn('领取成功！',1000)
            setTimeout(()=>{},1000)
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
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
    */
  },

  // 跳转到商户全部视频页面
  tapToShopVideoAll() {
    const that = this
    wx.navigateTo({
      url: '/pages/views/shop-video-all',
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('msInterviewVideoVoList', that.data.acData.msInterviewVideoVoList)
      }
    })
  },

  // 跳转到领券详情
  tapTopagesGetTicketDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/views/get-ticket-detail?id=' + id
    })
  },
  // 相关视频
  msSelectedMsVideoByMsId() {
    api.msSelectedMsVideoByMsId()
    .then(res=>{
      const data = res
      console.log(data)
      this.setData({
        videoList: data||[]
      })
    })
    .catch(err=>{
      console.log(err)
    })
  }
})