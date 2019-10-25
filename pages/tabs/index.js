// pages/tabs/index.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
import bmap from "../../utils/bmap-wx.min.js"
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    params: { //请求首页推荐列表
      limit: PAGE.limit,
      start: PAGE.start,
      paramEntity: {}
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    noData: false,  //没有数据时
    recommend: [], // 首页推荐体验列表
    vImgUrls: [], // 会员限时礼体验列表
    promotions: [], //会员专属列表
    vTimeTitle: '', //会员限时礼标题
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(wx.getStorageSync("userInfo"))
    // wx.navigateTo({
    //   url: '/pages/views/hot-activity'
    // })
    // wx.navigateTo({
    //   url: '/pages/views/ac-detail?id=610859100309291008' + '&title=3如如'
    // })
    NT.showToast('加载中...')
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.getPromotions()
    this.getLimitTimeGift()
    this.getExperience()
    // 获取当前位置
    // wx.getLocation({  
    //   type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
    //   success: function(res){  
    //     console.log(res)
    //     var locationForm = {
    //       longitude: res.longitude,
    //       latitude: res.latitude
    //     }
    //     api.getLocationCity(locationForm)
    //     .then(res=>{
    //       console.log(res)
    //     })
    //     .catch(err=>{
    //       console.log(err)
    //     })
    //   }
    // }) 
    this.getLocationCity()  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    NT.showToast('刷新中...')
    this.setData({
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {}
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.getPromotions()
    this.getLimitTimeGift()
    this.getExperience('onPullDownRefresh')
    this.getLocationCity()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // NT.showToast('加载中...')
    if ((this.data.params.start) * this.data.params.limit < this.data.total) {
      wx.showNavigationBarLoading();
      this.setData({
        loadmoreLine: false,
        loadmore: true
      })
      this.setData({
        params:{ //请求首页推荐列表
          limit: PAGE.limit,
          start: this.data.params.start + 1,
          paramEntity: {}
        }
      })
      this.getExperience()
    }else {
      //暂无更多数据
      NT.hideToast()
      if(this.data.recommend.length){
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
  //搜索事件
  search(e) {
    console.log(e)
  },
  //跳转搜索中心
  tapSearch() {
    wx.navigateTo({
      url: '/pages/views/search-center'
    })
  },
  vSwiperChange(e) { // 会员专属礼物滑动
    const current = e.detail.current
    this.data.vImgUrls.forEach((v,i) => {
      if(Number(i) === current){
        this.setData({
          vTimeTitle: v.vipActivityTitle
        })
      }
    });
  },
  tapToDetail(e) { // 点击查看体验详情
    const ID = e.currentTarget.dataset.id
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE
    })
  },
  tapToVipCenter() { // 点击进入会员介绍中心
    wx.navigateTo({
      url: '/pages/views/vip-center'
    })
  },
  tapToMapActivity() { // 点击进入活动地图
    wx.navigateTo({
      url: '/pages/views/map-activity'
    })
  },
  // 获取会员专属体验接口
  getPromotions() {
    api.getPromotions()
    .then(res=>{
      this.setData({
        promotions: res
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  //会员限时礼
  getLimitTimeGift() {
    let that = this
    api.getLimitTimeGift()
    .then(res=>{
      this.setData({
        vImgUrls: res,
        vTimeTitle: res.length ? res[0].vipActivityTitle : ''
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  //获取推荐列表
  getExperience(source) {
    let that = this
    api.getExperience(that.data.params)
    .then(res=>{
      let data = res.rows || []
      data.map(item => {
        // debugger
        item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D')
        item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
      })
      that.setData({
        noData: false,
        recommend: source === 'onPullDownRefresh' ? data : this.data.recommend.concat(data),
        total: res.total,
        loadmore: false
      })
      if(!that.data.recommend.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
    .catch(err=>{
      console.log(err)
      NT.showModal(err.codeMsg||err.message||'请求失败！')
      this.setData({
        loadmore: false,
      })
      if(!that.data.recommend.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
  },
  // 跳转到体验日历
  tapToActivityCalendar() {
    wx.navigateTo({
      url: '/pages/views/calendar-activity'
    })
  },
  // 跳转到人气体验
  tapToHotActivity() {
    wx.navigateTo({
      url: '/pages/views/hot-activity'
    })
  },
  // 跳转到web-view页面
  tapToWebView(e) {
    const url = e.currentTarget.dataset.url
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/web-view/web-view?url=' + url + '&title=' + TITLE
    })
  },
  // 跳转到kol入驻
  tapToKolEnter() {
    wx.navigateTo({
      url: '/pages/views/kol-enter'
    })
  },
  // 获取当前定位城市或者商圈
  getLocationCity() {
    var BMap = new bmap.BMapWX({
      ak: 'yGcrSwdG3beEibxivQuiShqGQxp4BSqc'
    });
    var success = data => {
        // console.log(data)
        wx.setStorage({
          key:"locationCity",
          data:data
        })
        const pois = data.originalData.result.pois[0]
        const rgcData = {
          business: pois.name,
          distance: pois.distance + 'm',
        }
        this.setData({
          rgcData: rgcData
        })
    }
    BMap.regeocoding({
        success: success
    });  
  }
})