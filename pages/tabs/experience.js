// pages/tabs/experience.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
import bmap from "../../utils/bmap-wx.min.js"
const app = getApp()
const titleBar = [ //顶部标题bar
  {
    name: '全部',
    labelId: ''
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navArray: ['推荐路线','精选商家'],
    idx: 0,
    titleBar: titleBar, //顶部标题bar
    name: titleBar[0].name, // 选中标题bar,默认第一位

    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    noData: false,  //没有数据时
    merchantList: [], // 商家列表
    params: {
      limit: PAGE.limit,
      start: PAGE.start,
      labelId: titleBar[0].labelId
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.msSelectMsLabelList()
    this.getLocationCity()
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
    NT.showToast('刷新中...')
    this.setData({
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start,
        labelId: this.data.params.labelId
      },
      loadmoreLine: false,
      loadmore: false
    })
    if(index === 1){
      this.msSelectedMsByLabel('onPullDownRefresh')
    }
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
      this.msSelectedMsByLabel()
    }else {
      //暂无更多数据
      NT.hideToast()
      if(this.data.merchantList.length){
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

  // }
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
  tapToMapActivity() { // 点击进入活动地图
    wx.navigateTo({
      url: '/pages/views/map-activity'
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
        city: data.originalData.result.addressComponent.city
      }
      this.setData({
        rgcData: rgcData
      })
    }
    BMap.regeocoding({
        success: success
    });  
  },
  tapToNav(e) { //切换菜单
    // console.log(e)
    const index = e.currentTarget.dataset.index
    this.setData({
      idx: index
    })
    if(index === 1){
      this.msSelectedMsByLabel()
    }
  },
  //点击tabbbar事件
  tapTitleBar: function(e){
    let name = e.currentTarget.dataset.name,
        labelId = e.currentTarget.dataset.labelid,
        t = this;
        if(name===this.data.name){
          return
        }
        // NT.showToast('加载中...');
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        t.setData({
          name:name,
          merchantList: [],
          loadmoreLine: false,
          loadmore: false,
          params: { //请求订单列表
            limit: PAGE.limit,
            start: PAGE.start,
            labelId: labelId
          }
        })
        // this.getOrderListPersonal()
        if(this.data.idx === 1){ //商家搜索
          this.msSelectedMsByLabel()
        }
        
  },

  // 轮播图
  vSwiperChange(e) {
    // console.log(e)
  },
  // 精选商家-按标签类别获取列表
  msSelectedMsByLabel(source) {
    NT.showToast('加载中...')
    const that = this
    api.msSelectedMsByLabel(this.data.params)
    .then(res=>{
      console.log(res)
      let data = res.data || []
      that.setData({
        noData: false,
        merchantList: source === 'onPullDownRefresh' ? data : this.data.merchantList.concat(data),
        total: res.total,
        loadmore: false
      })
      if(!that.data.merchantList.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
      this.setData({
        loadmore: false,
      })
      if(!that.data.merchantList.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
  },
  // 请求标签
  msSelectMsLabelList() {
    api.msSelectMsLabelList()
    .then(res=>{
      let data = res || []
      data.map(item => {
        // debugger
        item.name = item.remark
        item.labelId = item.id
      })
      this.setData({
        titleBar: this.data.titleBar.concat(data)
      })
    })
    .catch(err=>{
      console.log(err)
    })
  }
})