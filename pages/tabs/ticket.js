// pages/tabs/ticket.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
const app = getApp();
const titleBar = [ //顶部标题bar
  {
    name: '全部',
    type: ''
  },
  {
    name: '待支付',
    type: '1'
  },
  {
    name: '已支付',
    type: '2'
  },
  {
    name: '支付失败',
    type: '3'
  },
  {
    name: '失效',
    type: '4'
  },
  {
    name: '取消支付',
    type: '5'
  },
  {
    name: '退订',
    type: '6'
  },
  {
    name: '已完成',
    type: '7'
  },
  {
    name: '已退订',
    type: '8'
  },
  {
    name: '退订失败',
    type: '9'
  },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    titleBar: titleBar, //顶部标题bar
    name: titleBar[0].name, // 选中标题bar,默认第一位
    params: { //请求订单列表
      limit: PAGE.limit,
      start: PAGE.start,
      accountId: wx.getStorageSync("userInfo").userId,
      orderType: 4, // 订单类型 4代表优惠卷
      // isUse: '0', //优惠卷是否可用 0可用 1不可用
      // isEffective: '0', //优惠卷是否有效 0无效 1有效
      // status: ''//订单状态  1、待支付  2、已支付 3、支付失败 4、失效 5、取消支付 6、退订 7、已完成 8、已退订 9、退订失败
      // paramEntity: {
      //   status: 'A',  //A:待使用 B:已验票 C:已完成 D:已取消 ,
      //   userName: wx.getStorageSync("userInfo").userName
      // }
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息

    ticketData: [],

    recommend: [], // 推荐体验列表
    getGuessLike: false, //推荐体验列表是否已请求
    noData: false, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: '/pages/views/ticket-detail?id=1'
    // })
    this.setData({
      params: { //请求列表
        limit: PAGE.limit,
        start: PAGE.start,
        accountId: wx.getStorageSync("userInfo").userId,
        orderType: 4,
      },
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    NT.showToast('加载中...')
    this.poSelectDiscountList()
    // this.poSelectDiscountList()

    // wx.navigateTo({
    //   url: '/pages/views/order-detail?orderCode=20190814170055930217' + '&userName=59038' + '&status=A' + '&coverImgUrl=' + "https://byair-1256706050.cos.ap-guangzhou.myqcloud.com/dev/experience/608700601064226816/coverImg/byair_images_1565332047193_native.png"
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
    if(app.globalData.ticket){
      app.globalData.ticket = false
      this.onPullDownRefresh()
    }else{
      this.setData({
        userInfo: wx.getStorageSync("userInfo"), //用户信息
      })
    }
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
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      params: { //请求列表
        limit: PAGE.limit,
        start: PAGE.start,
        accountId: wx.getStorageSync("userInfo").userId,
        orderType: 4,
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.poSelectDiscountList('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.params.start) * this.data.params.limit < this.data.total) {
      wx.showNavigationBarLoading();
      this.setData({
        loadmoreLine: false,
        loadmore: true
      })
      this.data.params.start = this.data.params.start + 1;
      this.poSelectDiscountList()
    }else {
      //暂无更多数据
      NT.hideToast()
      if(this.data.ticketData.length){
        this.setData({
          loadmoreLine: true,
          loadmore: false
        })
      }else{
        this.setData({
          loadmore: false
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  //点击tabbbar事件
  tapTitleBar: function(e){
    let name = e.currentTarget.dataset.name,
        type = e.currentTarget.dataset.type,
        t = this;
        if(name===this.data.name){
          return
        }
        NT.showToast('加载中...');
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        t.setData({
          name:name,
          ticketData: [],
          loadmoreLine: false,
          loadmore: false
        })
        this.data.params = { //请求订单列表
          limit: PAGE.limit,
          start: PAGE.start,
          accountId: wx.getStorageSync("userInfo").userId,
          orderType: 4,
          status: type
          // paramEntity: {
          //   status: type,  //A:待使用 B:已验票 C:已完成 D:已取消 ,
          //   userName: wx.getStorageSync("userInfo").userName
          // }
        };
        this.poSelectDiscountList()
  },
  // 点击去订单详情
  tapToOrderDetail(e) {
    const orderCode = e.currentTarget.dataset.id
    const status = e.currentTarget.dataset.status
    const coverImgUrl = e.currentTarget.dataset.coverimgurl
    // 状态
    var statusStr = '';
    switch (status) {
      case 'A':
        statusStr = '待参加';
        break;
      case 'B':
        statusStr = '已验票';
        break;
      case 'C':
        statusStr = '已完成';
        break;
      case 'D':
        statusStr = '已退票';
        break;
      case 'E':
        statusStr = '已过期';
        break;
      default:
        statusStr = '其它';
        break;
    }
    wx.navigateTo({
      url: '/pages/views/order-detail?orderCode=' + orderCode + '&userName=' + wx.getStorageSync("userInfo").userName + '&status=' + status + '&coverImgUrl=' + coverImgUrl + '&statusStr=' + statusStr
    })
  },
  //点击去验票页面
  tapToTicketDetail(e){
    const orderCode = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/views/ticket-detail?orderCode=' + orderCode + '&userName=' + wx.getStorageSync("userInfo").userName
    })
  },
  // 取消订单
  tapCancelOrder(e) {
    const that = this
    const orderCode = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '您确定要取消该订单吗？取消将不可撤回',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          NT.showToast('处理中...')
          api.cancelOrder({orderCode:orderCode})
          .then(res=>{
            NT.showToastNone('订单取消成功')
            // that.poSelectDiscountList()
            that.refreshData(orderCode)
          })
          .catch(err=>{
            console.log(err)
            NT.showModal(err.codeMsg||err.message||'请求失败！')
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })    
  },
  // 刷新数据
  refreshData(e) {
    const that = this
    const ticketData = that.data.ticketData
    ticketData.forEach((element,index) => {
      if(element.orderCode === e){
        ticketData.splice(index,1)
      }
    });
    that.setData({
      ticketData: ticketData
    })
    if(!that.data.ticketData.length>0){ //暂无数据
      that.setData({
        noData: true
      })
    }
    if(!that.data.ticketData.length>0 && !that.data.getGuessLike){ //大于0
      that.getGuessLike()
    }
  },
  // 删除订单
  deleteOrder(e) {
    const that = this
    const orderCode = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '您确定要删除该订单记录吗？删除后将永久消失在订单列表',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          NT.showToast('处理中...')
          api.deleteOrder({orderCode:orderCode})
          .then(res=>{
            NT.showToastNone('订单删除成功')
            // that.poSelectDiscountList()
            that.refreshData(orderCode)
          })
          .catch(err=>{
            console.log(err)
            NT.showModal(err.codeMsg||err.message||'请求失败！')
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //请求订单列表
  poSelectDiscountList(source) {
    api.poSelectDiscountList(this.data.params)
    .then(res=>{
      // console.log(res)
      const data = res.data
      data.map(item => {
        // debugger
        item.endTime = util.formatTimeTwo(item.createTime,'Y/M/D')
      })
      this.setData({
        ticketData: source === 'onPullDownRefresh' ? data : this.data.ticketData.concat(data),
        total: res.total,
        loadmoreLine: false,
        loadmore: false,
        noData: false,
      })
      if(!this.data.ticketData.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
      if(!this.data.ticketData.length>0 && !this.data.getGuessLike){ //大于0
        this.getGuessLike()
      }
    })
    .catch(err=>{
      console.log(err)
      this.setData({
        loadmore: false,
      })
      if(err.code === '401'){
        this.setData({
          emptytext: err.codeMsg
        })
      }else{
        NT.showModal(err.codeMsg||err.message||'请求失败！')
      }
      if(!this.data.ticketData.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
    })
  },
  //获取猜你喜欢推荐数据
  getGuessLike() {
    this.data.getGuessLike = true
    // api.getGuessLike({userName:this.data.userInfo.userName})
    // .then(res=>{
    //   const data = res
    //   data.map(item => {
    //     // debugger
    //     // item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D h:m:s')
    //     item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
    //   })
    //   this.setData({
    //     recommend: data
    //   })
    //   console.log(data)
    // })
    // .catch(err=>{
    //   console.log(err)
    // })
    api.msSelectedMsListGuessYouLike()
    .then(res=>{
      const data = res
      this.setData({
        recommend: data
      })
    })
    .catch(err=>{
      console.log(err)
    })
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
                NT.toastFn('登录成功',1000)
                setTimeout(()=>{
                  that.onPullDownRefresh()
                },1000)
              })
              .catch((err)=>{
                if(err.code==='10019'){ //用户未注册
                  wx.navigateTo({
                    url: '/pages/login/login?openId='+err.data.openId + '&sessionKey=' + err.data.sessionKey + '&ticket=true',
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
  // 查询所有优惠卷
  // poSelectDiscountList() {
  //   const params = { //请求订单列表
  //     limit: PAGE.limit,
  //     start: PAGE.start,
  //     accountId: this.data.userInfo.userId
  //   }
  //   api.poSelectDiscountList(params)
  //   .then(res=>{
  //     debugger
  //   })
  //   .catch(err=>{
  //     NT.showModal(err.message||'请求失败！')
  //   })
  // }
})