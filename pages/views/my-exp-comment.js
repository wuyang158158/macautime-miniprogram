// pages/views/my-exp-comment.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    params: { //请求订单列表
      pageSize: PAGE.limit,
      page: PAGE.start
    },
    orderListParams: { //请求订单列表
      limit: PAGE.limit,
      start: PAGE.start,
      paramEntity: {
        isComment: 0, //是否评论
        status: 'C',  //A:待使用 B:已验票 C:已完成 D:已取消 ,
        userName: wx.getStorageSync("userInfo").userName
      }
    },
    ticketData: [],
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    onReachBottom: false,

    expComment: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      params: { //请求列表
        expId: options.expId,
        pageSize: PAGE.limit,
        page: PAGE.start
      },
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    // NT.showToast('加载中...')
    this.getOrderListPersonal()
    this.myComment()
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
    const mycomment = wx.getStorageSync("mycomment")
    if(mycomment==='myexp'){
      wx.removeStorageSync('mycomment')
      this.onPullDownRefresh()
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
        expId: this.data.params.expId,
        pageSize: PAGE.limit,
        page: PAGE.start
      },
      orderListParams: { //请求订单列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {
          isComment: 0, //是否评论
          status: 'C',  //A:待使用 B:已验票 C:已完成 D:已取消 ,
          userName: wx.getStorageSync("userInfo").userName
        }
      },
      loadmoreLine: false,
      loadmore: false,
      onReachBottom: false
    })
    this.getOrderListPersonal('onPullDownRefresh')
    this.myComment('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.onReachBottom){
      wx.showNavigationBarLoading();
      this.setData({
        loadmoreLine: false,
        loadmore: true
      })
      this.data.params.page = this.data.params.page + 1;
      this.myComment('onReachBottom')
      
    }
  },
  // 更多体验
  tapMoreExp: function() {
    wx.showNavigationBarLoading();
    this.data.orderListParams.start = this.data.orderListParams.start + 1;
    this.getOrderListPersonal()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    if(e.from === 'button'){
      const dataset = e.target.dataset;
      return {
        path: '/pages/login/login?id=' + dataset.experienceSerial + '&title=' + dataset.activityTitle + '&shareType=acDetail',
        title: dataset.activityTitle,
        imageUrl: dataset.coverurl
      }
    }
    
  },
  myComment(source) { // 请求评论列表
    api.myComment(this.data.params)
    .then(res=>{
      console.log(res)
      if(source === 'onReachBottom' && !res.length > 0){
        this.data.onReachBottom = true
        if(this.data.expComment.length){
          this.setData({
            loadmoreLine: true,
            loadmore: false
          })
        }else{
          this.setData({
            loadmore: false
          })
        }
        return
      }
      const data = source === 'onPullDownRefresh' ? res : this.data.expComment.concat(res||[])
      this.setData({
        expComment: data,
        loadmoreLine: false,
        loadmore: false,
        noData: false,
      })
      if(!this.data.expComment.length>0){ //暂无数据
        this.setData({
          noData: true
        })
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
      if(!this.data.expComment.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
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
  //请求订单列表
  getOrderListPersonal(source) {
    api.getOrderListPersonal(this.data.orderListParams)
    .then(res=>{
      // console.log(res)
      const data = res.rows
      this.setData({
        ticketData: source === 'onPullDownRefresh' ? data : this.data.ticketData.concat(data),
        total: res.total
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  }, 
  tapToTicketDetail(e){
    const orderCode = e.currentTarget.dataset.id
    const ticketData = this.data.ticketData
    let orderData = {}
    ticketData.map(item=>{
      if(item.orderCode === orderCode){
        orderData = item
      }
    })
    wx.navigateTo({
      url: '/pages/views/exp-comment?comment=myexp',
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', orderData)
      }
    })
  }
})