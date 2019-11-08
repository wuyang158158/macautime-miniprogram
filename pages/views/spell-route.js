// pages/views/spell-route.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 15, //地图缩放系数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    const locationCity = wx.getStorageSync("locationCity")
    const location = locationCity.originalData.result.location
    this.setData({
      latitude: location.lat,
      longitude: location.lng,
      // latitude: '34.822072',
      // longitude: '114.369229',
    })
    this.getNearExp()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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
    this.onLoad()
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
  bindregionchange(e) {  // 视野变化开始、结束时触发
    // console.log(e)
    const that = this
    if(e.detail.type === 'end') {
      this.mapCtx.getCenterLocation({
        success(res){
          // console.log(res)
          const form = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          // that.getNearExp(form)
        }
      })
    }
    
  },
  tapLocationInit(e) { //返回定位点
    // debugger
    // this.onLoad()
    // this.mapCtx.moveToLocation({
    //   longitude: this.data.longitude,
    //   latitude: this.data.latitude
    // })
    // this.getNearExp()

    this.setData({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: this.data.scale,
    })
  },
  getNearExp(form) { // 获取附近体验列表
    const roluForm = {
      // distances: 100000, // 100km
      distances: 0, 
      lat: form? form.latitude : this.data.latitude,
      lng: form? form.longitude : this.data.longitude
    }
    api.getNearExp(roluForm)
    .then(res=>{
      let data = res || []
      const callout = {
        content: '',
        color: '#FF0000',
        fontSize: 15,
        borderRadius: 1,
        display: 'ALWAYS',
      }
      data.map(item => {
        item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
        item.id = item.expSerial
        item.longitude = Number(item.lng)
        item.latitude = Number(item.lat)
        item.name = item.merchantName
        item.iconPath = '/images/detail/map_icon_logo.png'
        item.width = '52rpx'
        item.height = '62rpx'
        item.callout = callout
      })
      this.setData({
        recommend: data
      })
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
  bindmarkertap(e) { //点击标记点去导航
    console.log(e)
    const markerId = e.markerId
    const data = this.data.recommend
    data.map(item => {
      if(item.id === markerId){
        wx.openLocation({
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          name: item.name,
          scale: 15
        })
      }
    })
  },

  // 下订单
  submitOrder() {
    wx.navigateTo({
      url: '/pages/views/spell-route-order'
    })
  }
})